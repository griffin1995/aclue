# aclue Performance Monitoring Infrastructure

## Overview

This directory contains a comprehensive performance monitoring solution for the aclue platform using Prometheus and Grafana. The monitoring stack provides real-time visibility into application performance, infrastructure health, and business metrics.

## Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Frontend   │────▶│  Prometheus  │────▶│   Grafana    │
│   (Next.js)  │     │   (Metrics)  │     │ (Dashboards) │
└──────────────┘     └──────────────┘     └──────────────┘
                            │                     │
┌──────────────┐            │                     │
│   Backend    │────────────┘                     │
│  (FastAPI)   │                                  │
└──────────────┘                                  │
                                                   │
┌──────────────┐     ┌──────────────┐            │
│   Database   │────▶│   Exporters  │────────────┘
│  (Supabase)  │     │              │
└──────────────┘     └──────────────┘
```

## Components

### 1. Prometheus (Metrics Collection)
- **Port**: 9090
- **Config**: `prometheus/prometheus.yml`
- **Features**:
  - Service discovery for dynamic endpoints
  - 30-day retention with 10GB storage limit
  - Remote write to VictoriaMetrics for long-term storage

### 2. Grafana (Visualization)
- **Port**: 3000
- **Credentials**: admin / aclue-monitoring-2024
- **Dashboards**:
  - Executive Dashboard (Business metrics)
  - Technical Dashboard (Infrastructure)
  - APM Dashboard (Application performance)

### 3. AlertManager (Alert Routing)
- **Port**: 9093
- **Config**: `docker/alertmanager.yml`
- **Channels**: Email, Slack, PagerDuty

### 4. Exporters
- **Node Exporter** (9100): System metrics
- **Blackbox Exporter** (9115): Endpoint monitoring
- **PostgreSQL Exporter** (9187): Database metrics
- **cAdvisor** (8080): Container metrics

## Quick Start

### Local Development

1. **Start the monitoring stack**:
```bash
cd monitoring/docker
docker-compose up -d
```

2. **Access services**:
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3000 (admin/aclue-monitoring-2024)
- AlertManager: http://localhost:9093

3. **Verify metrics collection**:
```bash
# Check Prometheus targets
curl http://localhost:9090/api/v1/targets

# Query a metric
curl http://localhost:9090/api/v1/query?query=up
```

### Production Deployment

#### Option 1: DigitalOcean Droplet

1. **Create a droplet**:
```bash
# Recommended: 2GB RAM, 2 vCPUs, 50GB SSD
# Ubuntu 22.04 LTS
```

2. **Install Docker**:
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

3. **Deploy monitoring stack**:
```bash
git clone https://github.com/aclue/monitoring.git
cd monitoring/docker
docker-compose up -d
```

4. **Configure firewall**:
```bash
sudo ufw allow 22/tcp
sudo ufw allow 3000/tcp  # Grafana
sudo ufw allow 9090/tcp  # Prometheus (restrict to your IP)
sudo ufw enable
```

#### Option 2: Railway Deployment

1. **Create Railway project**:
```bash
railway login
railway init
railway link
```

2. **Deploy services**:
```bash
railway up --service prometheus
railway up --service grafana
```

3. **Set environment variables**:
```bash
railway variables set GF_SECURITY_ADMIN_PASSWORD=<secure-password>
railway variables set PROMETHEUS_RETENTION_TIME=30d
```

#### Option 3: AWS EC2

1. **Launch EC2 instance**:
```bash
# t3.medium recommended
# Amazon Linux 2 or Ubuntu 22.04
```

2. **Security group rules**:
- SSH (22): Your IP
- Grafana (3000): 0.0.0.0/0 (or restricted)
- Prometheus (9090): Private subnet only

3. **Deploy using CloudFormation**:
```yaml
# See monitoring/aws/cloudformation.yml
```

## Backend Integration

### FastAPI Setup

1. **Add dependencies**:
```bash
pip install prometheus-client psutil
```

2. **Add middleware to main.py**:
```python
from app.monitoring.metrics import prometheus_middleware, metrics_endpoint

# Add middleware
app.middleware("http")(prometheus_middleware)

# Add metrics endpoint
@app.get("/metrics")
async def get_metrics():
    return await metrics_endpoint()
```

3. **Track business metrics**:
```python
from app.monitoring.metrics import track_business_metric

# In your auth endpoint
track_business_metric('user_login', {'status': 'success'})

# In newsletter subscription
track_business_metric('newsletter_subscription', {'status': 'success'})
```

## Frontend Integration

### Next.js Setup

1. **Install dependencies**:
```bash
npm install web-vitals
```

2. **Add to _app.tsx**:
```tsx
import { performanceMonitor } from '@/lib/monitoring/performance'

// Initialize monitoring
if (typeof window !== 'undefined') {
  // Monitor is auto-initialized
}
```

3. **Track custom events**:
```tsx
import { trackInteraction, trackApiCall } from '@/lib/monitoring/performance'

// Track user interaction
trackInteraction('button_click', 'newsletter_subscribe')

// Track API calls
const start = Date.now()
const response = await fetch('/api/subscribe')
trackApiCall('/api/subscribe', 'POST', Date.now() - start, response.status)
```

## Metrics Reference

### Application Metrics

| Metric | Description | Type |
|--------|-------------|------|
| `http_requests_total` | Total HTTP requests | Counter |
| `http_request_duration_seconds` | Request latency | Histogram |
| `user_registrations_total` | User registrations | Counter |
| `newsletter_subscriptions_total` | Newsletter signups | Counter |
| `product_recommendations_viewed_total` | Product views | Counter |

### System Metrics

| Metric | Description | Type |
|--------|-------------|------|
| `system_cpu_usage_percent` | CPU usage | Gauge |
| `system_memory_usage_bytes` | Memory usage | Gauge |
| `db_connections_active` | Active DB connections | Gauge |

### Web Vitals

| Metric | Description | Good | Poor |
|--------|-------------|------|------|
| LCP | Largest Contentful Paint | <2.5s | >4s |
| FID | First Input Delay | <100ms | >300ms |
| CLS | Cumulative Layout Shift | <0.1 | >0.25 |

## Alerting Configuration

### Alert Severity Levels

- **Critical**: Immediate action required (PagerDuty)
- **Warning**: Investigation needed (Email + Slack)
- **Info**: Awareness only (Email digest)

### Key Alerts

1. **Performance**:
   - P95 response time > 500ms
   - Error rate > 5%

2. **Infrastructure**:
   - CPU usage > 90%
   - Memory usage > 85%
   - Disk space < 20%

3. **Business**:
   - No registrations for 2 hours
   - Newsletter subscription rate < 1/hour

4. **Security**:
   - Auth failure rate > 30%
   - Rate limiting triggered

## Dashboard Usage

### Executive Dashboard
- **Purpose**: Business metrics overview
- **Users**: Management, Product team
- **Key Metrics**: User activity, conversion rates, revenue impact

### Technical Dashboard
- **Purpose**: Infrastructure health
- **Users**: DevOps, Engineering
- **Key Metrics**: Resource usage, container performance, database stats

### APM Dashboard
- **Purpose**: Application performance
- **Users**: Developers
- **Key Metrics**: Response times, error rates, slow endpoints

## Maintenance

### Daily Tasks
- Check alert summary in Grafana
- Review error rate trends
- Monitor disk space usage

### Weekly Tasks
- Review slow query logs
- Analyze performance trends
- Update alerting thresholds

### Monthly Tasks
- Review and optimize dashboards
- Clean up old metrics data
- Update retention policies
- Generate performance reports

## Troubleshooting

### Common Issues

1. **Prometheus not scraping targets**:
```bash
# Check target status
curl http://localhost:9090/api/v1/targets

# Check logs
docker logs aclue-prometheus
```

2. **Grafana dashboards not loading**:
```bash
# Check datasource connection
curl http://localhost:3000/api/datasources

# Restart Grafana
docker restart aclue-grafana
```

3. **High memory usage**:
```bash
# Check Prometheus storage
du -sh /var/lib/docker/volumes/aclue-prometheus-data

# Reduce retention
docker exec -it aclue-prometheus promtool tsdb clean /prometheus
```

4. **Missing metrics**:
```bash
# Verify exporter is running
docker ps | grep exporter

# Check network connectivity
docker exec -it aclue-prometheus wget -O- http://node-exporter:9100/metrics
```

## Performance Optimization

### Prometheus Optimization
- Use recording rules for frequently queried metrics
- Implement proper label cardinality limits
- Enable query result caching

### Grafana Optimization
- Use variable templates to reduce queries
- Enable dashboard caching
- Optimize panel refresh intervals

### Query Examples

```promql
# Average response time by endpoint
avg by (endpoint) (
  rate(http_request_duration_seconds_sum[5m]) /
  rate(http_request_duration_seconds_count[5m])
)

# Error rate percentage
100 * (
  sum(rate(http_requests_total{status=~"5.."}[5m])) /
  sum(rate(http_requests_total[5m]))
)

# Database connection pool usage
db_connections_active /
(db_connections_active + db_connections_idle)
```

## Cost Optimization

### Estimated Monthly Costs

| Provider | Specification | Cost/Month |
|----------|--------------|------------|
| DigitalOcean | 2GB Droplet | $12 |
| AWS EC2 | t3.small | $15 |
| Railway | Hobby plan | $5 |
| Grafana Cloud | Free tier | $0 |

### Cost-Saving Tips
1. Use VictoriaMetrics for long-term storage (more efficient)
2. Implement metric sampling for high-cardinality data
3. Use Grafana Cloud free tier for small teams
4. Optimize retention policies based on actual needs

## Security Considerations

1. **Authentication**:
   - Change default Grafana password
   - Enable HTTPS with Let's Encrypt
   - Use OAuth/SSO for production

2. **Network Security**:
   - Restrict Prometheus access to internal network
   - Use VPN for remote access
   - Enable firewall rules

3. **Data Protection**:
   - Encrypt metrics at rest
   - Regular backups of Grafana dashboards
   - Audit log access

## Integration with CI/CD

### GitHub Actions
```yaml
- name: Check Performance
  run: |
    response_time=$(curl -s http://prometheus:9090/api/v1/query \
      --data-urlencode 'query=histogram_quantile(0.95, http_request_duration_seconds_bucket)' \
      | jq -r '.data.result[0].value[1]')

    if (( $(echo "$response_time > 0.5" | bc -l) )); then
      echo "Performance regression detected"
      exit 1
    fi
```

## Support

- **Documentation**: This README
- **Issues**: GitHub Issues
- **Community**: Prometheus/Grafana community forums

## License

MIT License - See LICENSE file for details