# GiftSync Cloudflare Automation

Enterprise-grade Cloudflare automation scripts integrated into the GiftSync project structure.

## Directory Structure

```
cloudflare-automation/
├── .env                      # Environment configuration (git-ignored)
├── backups/                  # DNS backups (git-ignored contents)
├── logs/                     # Operation logs (git-ignored contents)
├── config/                   # Configuration files
├── scripts/                  # Helper scripts
├── *.sh                      # Main automation scripts
└── README.md                 # This file
```

## Key Scripts

- `check-status.sh` - Check SSL, security settings, and DNS for all domains
- `dns-backup.sh` - Create backups of DNS records
- `purge-cache.sh` - Purge Cloudflare cache for all domains
- `deploy-with-cache-purge.sh` - Deploy with automatic cache purging
- `security-headers.sh` - Configure enterprise security headers
- `monitor-domains.sh` - Monitor domain health and security

## Configuration

All scripts use the `.env` file in this directory for configuration:

```bash
# Example .env configuration
CLOUDFLARE_API_TOKEN=your_token_here
CLOUDFLARE_ACCOUNT_ID=your_account_id
PROJECT_ROOT=/home/jack/Documents/gift_sync
DOMAINS="aclue.co.uk aclue.app"
BACKUP_DIR="${PROJECT_ROOT}/cloudflare-automation/backups"
LOG_DIR="${PROJECT_ROOT}/cloudflare-automation/logs"
```

## Usage

All scripts are designed to be run from within the cloudflare-automation directory:

```bash
cd /home/jack/Documents/gift_sync/cloudflare-automation
./check-status.sh
./dns-backup.sh
./purge-cache.sh
```

## Integration

These scripts are fully integrated into the GiftSync project:
- ✅ Project-relative paths for all operations
- ✅ Centralised .env configuration 
- ✅ Proper logging to project log directory
- ✅ Git integration with sensitive data excluded
- ✅ All scripts tested and working

## Security

- API tokens and sensitive data are stored in `.env` (git-ignored)
- Backup and log contents are git-ignored
- Directory structure is preserved in git with `.gitkeep` files