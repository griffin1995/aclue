#!/usr/bin/env node

/**
 * Vercel Deployment Webhook Handler
 * 
 * This webhook receives deployment notifications from Vercel and triggers
 * automatic Cloudflare cache purging with comprehensive error handling.
 * 
 * Deploy this as a serverless function or API endpoint that Vercel can reach.
 */

const https = require('https');
const crypto = require('crypto');

// Configuration
const CONFIG = {
  CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN,
  VERCEL_WEBHOOK_SECRET: process.env.VERCEL_WEBHOOK_SECRET,
  DOMAINS: ['aclue.co.uk', 'aclue.app'],
  SLACK_WEBHOOK_URL: process.env.SLACK_WEBHOOK_URL,
  MAX_RETRIES: 3,
  RETRY_DELAY: 2000, // 2 seconds
  TIMEOUT: 30000, // 30 seconds
};

// Logging utility
const log = {
  info: (message, data = {}) => console.log(JSON.stringify({ 
    level: 'info', 
    message, 
    timestamp: new Date().toISOString(),
    ...data 
  })),
  error: (message, error = {}) => console.error(JSON.stringify({ 
    level: 'error', 
    message, 
    timestamp: new Date().toISOString(),
    error: error.message || error,
    stack: error.stack 
  })),
  warn: (message, data = {}) => console.warn(JSON.stringify({ 
    level: 'warn', 
    message, 
    timestamp: new Date().toISOString(),
    ...data 
  }))
};

/**
 * Verify Vercel webhook signature
 */
function verifyWebhookSignature(body, signature, secret) {
  if (!signature || !secret) return false;
  
  const expectedSignature = crypto
    .createHmac('sha1', secret)
    .update(body)
    .digest('hex');
    
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(`sha1=${expectedSignature}`)
  );
}

/**
 * Make HTTP request with retry logic
 */
function makeRequest(options, data = null, retries = CONFIG.MAX_RETRIES) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = responseData ? JSON.parse(responseData) : {};
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ statusCode: res.statusCode, data: parsedData });
          } else {
            throw new Error(`HTTP ${res.statusCode}: ${responseData}`);
          }
        } catch (error) {
          reject(new Error(`Response parsing failed: ${error.message}`));
        }
      });
    });
    
    req.on('error', async (error) => {
      if (retries > 0) {
        log.warn(`Request failed, retrying in ${CONFIG.RETRY_DELAY}ms`, { 
          error: error.message, 
          retriesLeft: retries - 1 
        });
        
        await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY));
        
        try {
          const result = await makeRequest(options, data, retries - 1);
          resolve(result);
        } catch (retryError) {
          reject(retryError);
        }
      } else {
        reject(error);
      }
    });
    
    req.setTimeout(CONFIG.TIMEOUT, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    
    req.end();
  });
}

/**
 * Get Cloudflare zone ID for a domain
 */
async function getZoneId(domain) {
  const options = {
    hostname: 'api.cloudflare.com',
    path: `/client/v4/zones?name=${domain}`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${CONFIG.CLOUDFLARE_API_TOKEN}`,
      'Content-Type': 'application/json'
    }
  };
  
  try {
    const response = await makeRequest(options);
    
    if (!response.data.result || response.data.result.length === 0) {
      throw new Error(`Zone not found for domain: ${domain}`);
    }
    
    return response.data.result[0].id;
  } catch (error) {
    log.error(`Failed to get zone ID for ${domain}`, error);
    throw error;
  }
}

/**
 * Purge Cloudflare cache for a zone
 */
async function purgeZoneCache(zoneId, domain) {
  const options = {
    hostname: 'api.cloudflare.com',
    path: `/client/v4/zones/${zoneId}/purge_cache`,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CONFIG.CLOUDFLARE_API_TOKEN}`,
      'Content-Type': 'application/json'
    }
  };
  
  const purgeData = {
    purge_everything: true
  };
  
  try {
    const response = await makeRequest(options, purgeData);
    
    if (!response.data.success) {
      throw new Error(`Cache purge failed: ${JSON.stringify(response.data.errors)}`);
    }
    
    log.info(`Cache purged successfully for ${domain}`, { zoneId });
    return response.data;
  } catch (error) {
    log.error(`Failed to purge cache for ${domain}`, error);
    throw error;
  }
}

/**
 * Send Slack notification
 */
async function sendSlackNotification(message, status = 'info') {
  if (!CONFIG.SLACK_WEBHOOK_URL) {
    log.warn('Slack webhook URL not configured, skipping notification');
    return;
  }
  
  const colors = {
    success: '#36a64f',
    error: '#ff0000',
    warning: '#ffaa00',
    info: '#36a64f'
  };
  
  const slackData = {
    attachments: [{
      color: colors[status] || colors.info,
      title: 'aclue Deployment Notification',
      text: message,
      timestamp: Math.floor(Date.now() / 1000)
    }]
  };
  
  const url = new URL(CONFIG.SLACK_WEBHOOK_URL);
  const options = {
    hostname: url.hostname,
    path: url.pathname,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  try {
    await makeRequest(options, slackData);
    log.info('Slack notification sent successfully');
  } catch (error) {
    log.error('Failed to send Slack notification', error);
    // Don't throw here - notification failure shouldn't break the main flow
  }
}

/**
 * Process deployment webhook
 */
async function processDeployment(payload) {
  const { 
    deployment, 
    environment = 'production',
    trigger = 'vercel-webhook',
    commit_sha,
    purge_cache = true 
  } = payload;
  
  log.info('Processing deployment webhook', {
    deploymentId: deployment?.id,
    environment,
    trigger,
    commit_sha
  });
  
  // Only process production deployments by default
  if (environment !== 'production' && !purge_cache) {
    log.info('Skipping cache purge for non-production deployment');
    return { success: true, message: 'Non-production deployment, cache purge skipped' };
  }
  
  // Check deployment state
  if (deployment && deployment.state !== 'READY') {
    log.warn('Deployment not ready, skipping cache purge', { 
      state: deployment.state,
      deploymentId: deployment.id 
    });
    return { success: false, message: 'Deployment not ready' };
  }
  
  const results = [];
  const errors = [];
  
  // Process each domain
  for (const domain of CONFIG.DOMAINS) {
    try {
      log.info(`Processing cache purge for ${domain}`);
      
      const zoneId = await getZoneId(domain);
      await purgeZoneCache(zoneId, domain);
      
      results.push({
        domain,
        status: 'success',
        zoneId
      });
      
    } catch (error) {
      log.error(`Cache purge failed for ${domain}`, error);
      errors.push({
        domain,
        error: error.message
      });
    }
  }
  
  // Send notifications
  const successCount = results.length;
  const errorCount = errors.length;
  
  if (errorCount === 0) {
    await sendSlackNotification(
      `✅ Cache purged successfully for all ${successCount} domains\n` +
      `Deployment: ${deployment?.url || 'N/A'}\n` +
      `Environment: ${environment}\n` +
      `Trigger: ${trigger}`,
      'success'
    );
    
    return {
      success: true,
      message: `Cache purged for ${successCount} domains`,
      results
    };
  } else if (successCount > 0) {
    await sendSlackNotification(
      `⚠️ Partial cache purge success\n` +
      `✅ Success: ${successCount} domains\n` +
      `❌ Failed: ${errorCount} domains\n` +
      `Deployment: ${deployment?.url || 'N/A'}\n` +
      `Errors: ${errors.map(e => `${e.domain}: ${e.error}`).join(', ')}`,
      'warning'
    );
    
    return {
      success: false,
      message: `Partial success: ${successCount} succeeded, ${errorCount} failed`,
      results,
      errors
    };
  } else {
    await sendSlackNotification(
      `❌ Cache purge failed for all domains\n` +
      `Deployment: ${deployment?.url || 'N/A'}\n` +
      `Environment: ${environment}\n` +
      `Errors: ${errors.map(e => `${e.domain}: ${e.error}`).join(', ')}`,
      'error'
    );
    
    return {
      success: false,
      message: 'Cache purge failed for all domains',
      errors
    };
  }
}

/**
 * Main webhook handler
 */
async function handleWebhook(event) {
  try {
    // Parse the request
    const body = event.body || '';
    const signature = event.headers['x-vercel-signature'] || event.headers['X-Vercel-Signature'];
    
    // Verify webhook signature if secret is configured
    if (CONFIG.VERCEL_WEBHOOK_SECRET) {
      const isValid = verifyWebhookSignature(body, signature, CONFIG.VERCEL_WEBHOOK_SECRET);
      if (!isValid) {
        log.error('Invalid webhook signature');
        return {
          statusCode: 401,
          body: JSON.stringify({ error: 'Invalid signature' })
        };
      }
    }
    
    // Parse payload
    let payload;
    try {
      payload = typeof body === 'string' ? JSON.parse(body) : body;
    } catch (error) {
      log.error('Invalid JSON payload', error);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid JSON payload' })
      };
    }
    
    // Process the deployment
    const result = await processDeployment(payload);
    
    return {
      statusCode: result.success ? 200 : 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(result)
    };
    
  } catch (error) {
    log.error('Webhook processing failed', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: false,
        error: 'Internal server error',
        message: error.message
      })
    };
  }
}

// Export for serverless environments
module.exports = { handleWebhook, processDeployment };

// CLI execution for testing
if (require.main === module) {
  const testPayload = {
    deployment: {
      id: 'test-deployment',
      url: 'https://test.vercel.app',
      state: 'READY'
    },
    environment: 'production',
    trigger: 'manual-test',
    purge_cache: true
  };
  
  processDeployment(testPayload)
    .then(result => {
      console.log('Test completed:', JSON.stringify(result, null, 2));
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('Test failed:', error);
      process.exit(1);
    });
}