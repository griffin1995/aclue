aclue Project Setup Package - Configuration Files
================================================

This package contains all the configuration files that are NOT stored in the git repository
due to security reasons (API keys, database credentials, etc.).

CONTENTS:
---------

1. backend_env - Copy this as backend/.env
   Contains: Database URLs, API keys, Supabase configuration

2. backend_env_production - Copy this as backend/.env.production  
   Contains: Production environment configuration

3. web_env_local - Copy this as web/.env.local
   Contains: Frontend development environment variables

4. web_env_production - Copy this as web/.env.production
   Contains: Frontend production environment variables

5. venv_setup.sh - Script to recreate Python virtual environment
   
6. development_certificates/ - Development SSL certificates (if any)

7. claude_settings/ - Claude IDE configuration

EXTRACTION INSTRUCTIONS:
-----------------------

After cloning the git repository:

1. Extract this ZIP file to the project root directory
2. Move files to their correct locations:
   
   mv backend_env backend/.env
   mv backend_env_production backend/.env.production
   mv web_env_local web/.env.local
   mv web_env_production web/.env.production
   
3. Run the virtual environment setup:
   chmod +x venv_setup.sh
   ./venv_setup.sh

4. Continue with the main setup guide in DEVICE_SYNC_SETUP.md

SECURITY NOTES:
--------------
- These files contain sensitive API keys and credentials
- Never commit these files to version control
- Regenerate keys if this package is compromised
- Use different credentials for production vs development

VERIFICATION:
------------
After extraction, verify these files exist:
- backend/.env (with DATABASE_URL, SUPABASE keys)
- backend/.env.production 
- web/.env.local (with NEXT_PUBLIC_* variables)
- web/.env.production

Contact: Refer to DEVICE_SYNC_SETUP.md for troubleshooting