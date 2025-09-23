#!/bin/bash

# aclue Performance Monitoring Setup Script
# This script sets up comprehensive monitoring for the aclue platform

set -e

echo "📊 Setting up aclue Performance Monitoring..."

# Create necessary directories
echo "📁 Creating monitoring directories..."
mkdir -p prometheus/rules
mkdir -p grafana/provisioning/datasources
mkdir -p grafana/provisioning/dashboards
mkdir -p grafana/dashboards
mkdir -p alertmanager
mkdir -p loki
mkdir -p promtail

# Create Grafana datasource configuration
echo "🔧 Configuring Grafana datasources..."
cat > grafana/provisioning/datasources/prometheus.yml << EOF
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
    editable: true

  - name: Loki
    type: loki
    access: proxy
    url: http://loki:3100
    editable: true
EOF

# Create Grafana dashboard provisioning
cat > grafana/provisioning/dashboards/default.yml << EOF
apiVersion: 1

providers:
  - name: 'default'
    orgId: 1
    folder: ''
    type: file
    disableDeletion: false
    updateIntervalSeconds: 10
    options:
      path: /var/lib/grafana/dashboards
EOF

# Create Alertmanager configuration
echo "🚨 Configuring Alertmanager..."
cat > alertmanager/alertmanager.yml << EOF
global:
  resolve_timeout: 5m

route:
  group_by: ['alertname', 'cluster', 'service']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 12h
  receiver: 'default'
  routes:
    - match:
        severity: critical
      receiver: 'critical'
      continue: true

receivers:
  - name: 'default'
    webhook_configs:
      - url: 'http://localhost:5001/webhook'
        send_resolved: true

  - name: 'critical'
    email_configs:
      - to: 'alerts@aclue.app'
        from: 'monitoring@aclue.app'
        smarthost: 'smtp.resend.com:587'
        auth_username: 'resend'
        auth_password: '\${RESEND_API_KEY}'
        headers:
          Subject: 'CRITICAL: aclue Platform Alert'

inhibit_rules:
  - source_match:
      severity: 'critical'
    target_match:
      severity: 'warning'
    equal: ['alertname', 'cluster', 'service']
EOF

# Create Loki configuration
echo "📝 Configuring Loki..."
cat > loki/loki-config.yaml << EOF
auth_enabled: false

server:
  http_listen_port: 3100

ingester:
  lifecycler:
    address: 127.0.0.1
    ring:
      kvstore:
        store: inmemory
      replication_factor: 1
    final_sleep: 0s

schema_config:
  configs:
    - from: 2020-10-24
      store: boltdb-shipper
      object_store: filesystem
      schema: v11
      index:
        prefix: index_
        period: 24h

storage_config:
  boltdb_shipper:
    active_index_directory: /loki/boltdb-shipper-active
    cache_location: /loki/boltdb-shipper-cache
    shared_store: filesystem
  filesystem:
    directory: /loki/chunks

compactor:
  working_directory: /loki/boltdb-shipper-compactor
  shared_store: filesystem

limits_config:
  enforce_metric_name: false
  reject_old_samples: true
  reject_old_samples_max_age: 168h
EOF

# Create Promtail configuration
echo "📋 Configuring Promtail..."
cat > promtail/promtail-config.yaml << EOF
server:
  http_listen_port: 9080
  grpc_listen_port: 0

positions:
  filename: /tmp/positions.yaml

clients:
  - url: http://loki:3100/loki/api/v1/push

scrape_configs:
  - job_name: system
    static_configs:
      - targets:
          - localhost
        labels:
          job: varlogs
          __path__: /var/log/*log

  - job_name: containers
    static_configs:
      - targets:
          - localhost
        labels:
          job: containerlogs
          __path__: /var/lib/docker/containers/*/*log
EOF

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose is not installed. Please install docker-compose first."
    exit 1
fi

echo "✅ Monitoring configuration created successfully!"
echo ""
echo "To start monitoring stack:"
echo "  cd monitoring && docker-compose -f docker-compose.monitoring.yml up -d"
echo ""
echo "Access points:"
echo "  📊 Grafana: http://localhost:3001 (admin/aclue_monitoring_2025)"
echo "  📈 Prometheus: http://localhost:9090"
echo "  🚨 Alertmanager: http://localhost:9093"
echo ""
echo "Next steps:"
echo "1. Update RESEND_API_KEY in alertmanager/alertmanager.yml"
echo "2. Configure actual endpoint URLs in prometheus/prometheus.yml"
echo "3. Import additional Grafana dashboards as needed"
echo "4. Set up external monitoring endpoints"