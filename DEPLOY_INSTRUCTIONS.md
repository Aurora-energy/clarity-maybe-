# Deployment Guide (LLM Prompt)

**Usage:** Copy and paste the prompt below into an AI Assistant (like ChatGPT, Claude, or Gemini) to generate a deployment script, or follow the "Manual Reference" section yourself.

---

## 🤖 AI Prompt

> "Act as a Senior DevOps Engineer. I need to deploy a **React + SurrealDB** application stack to a fresh **Debian 13 (Trixie)** Virtual Machine.
>
> **Stack Details:**
> 1.  **Frontend:** React Single Page Application (Vite build). Source location: `/var/www/clarity-app`.
> 2.  **Database:** SurrealDB (Latest Stable).
>
> **Requirements:**
> Please write a complete `setup.sh` bash script that performs the following:
>
> 1.  **System Init:**
>     - Update `apt` repositories and upgrade packages.
>     - Install core tools: `curl`, `git`, `nginx`, `ufw`.
>
> 2.  **SurrealDB Setup:**
>     - Install SurrealDB using the official install script (`curl -sSf https://install.surrealdb.com | sh`).
>     - Create a dedicated system user named `surreal`.
>     - Create a Systemd service file at `/etc/systemd/system/surrealdb.service`.
>     - **Service Config:**
>         - Bind to `127.0.0.1:8000`.
>         - Persist data to `/var/lib/surrealdb/data.db`.
>         - Set initial root credentials (user: `root`, pass: `root`).
>     - Enable and start the service.
>
> 3.  **Frontend Build Environment:**
>     - Install **Node.js v20 (LTS)**.
>     - Navigate to `/var/www/clarity-app`.
>     - Run `npm install` and `npm run build`.
>
> 4.  **Nginx Configuration:**
>     - Create a site config `/etc/nginx/sites-available/clarity`.
>     - **Root:** Serve files from `/var/www/clarity-app/dist`.
>     - **SPA Routing:** Ensure `location /` redirects 404s to `index.html` (e.g., `try_files $uri $uri/ /index.html;`).
>     - **Proxy:** Forward `location /rpc` to `http://127.0.0.1:8000` (support WebSockets for SurrealDB).
>     - Enable the site and remove the default config.
>
> 5.  **Security & Finalize:**
>     - Configure UFW to allow OpenSSH and Nginx Full (80/443).
>     - Set recursive ownership of `/var/www/clarity-app` to `www-data`.
>     - Restart Nginx."

---

## 🛠️ Manual Reference

If you are deploying manually, execute the following commands in order:

### 1. System Preparation
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git nginx ufw
```

### 2. Install & Configure SurrealDB
```bash
# Install
curl -sSf https://install.surrealdb.com | sh

# Setup User & Dir
sudo useradd -r -s /bin/false surreal
sudo mkdir -p /var/lib/surrealdb
sudo chown -R surreal:surreal /var/lib/surrealdb

# Create Service
sudo tee /etc/systemd/system/surrealdb.service > /dev/null <<EOF
[Unit]
Description=SurrealDB Database Server
Documentation=https://surrealdb.com/docs
After=network-online.target

[Service]
User=surreal
Group=surreal
ExecStart=/usr/local/bin/surreal start --log debug --user root --pass root --bind 127.0.0.1:8000 file:////var/lib/surrealdb/data.db
Restart=always
RestartSec=5
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF

# Start
sudo systemctl daemon-reload
sudo systemctl enable --now surrealdb
```

### 3. Build Frontend
```bash
# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Prepare Directory (Upload your source code here first!)
sudo mkdir -p /var/www/clarity-app
# cd /var/www/clarity-app
# [Upload Code]

# Build
sudo npm install
sudo npm run build
```

### 4. Configure Nginx
```bash
sudo tee /etc/nginx/sites-available/clarity > /dev/null <<EOF
server {
    listen 80;
    server_name _;
    root /var/www/clarity-app/dist;
    index index.html;

    # React SPA Routing
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # SurrealDB Proxy (Optional, if accessing DB directly from client)
    location /rpc {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
EOF

# Enable Site
sudo ln -s /etc/nginx/sites-available/clarity /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
```

### 5. Finalize
```bash
# Permissions
sudo chown -R www-data:www-data /var/www/clarity-app

# Firewall
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable

# Restart Web Server
sudo systemctl restart nginx
```