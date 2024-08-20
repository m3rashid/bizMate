#!/bin/bash

# Install caddy server (Run on the server)
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy

# Copy the required files (Run locally)
scp -i ~/Downloads/bizmateec2sshkey.pem -r ./backend/bin/backend ubuntu@ec2-13-201-73-93.ap-south-1.compute.amazonaws.com:/home/ubuntu/app
scp -i ~/Downloads/bizmateec2sshkey.pem -r ./backend/public ubuntu@ec2-13-201-73-93.ap-south-1.compute.amazonaws.com:/home/ubuntu/app/public
scp -i ~/Downloads/bizmateec2sshkey.pem -r ./backend/i18n ubuntu@ec2-13-201-73-93.ap-south-1.compute.amazonaws.com:/home/ubuntu/app/i18n
scp -i ~/Downloads/bizmateec2sshkey.pem -r ./backend/Caddyfile ubuntu@ec2-13-201-73-93.ap-south-1.compute.amazonaws.com:/etc/caady
scp -i ~/Downloads/bizmateec2sshkey.pem -r ./backend/bizmateapi.service ubuntu@ec2-13-201-73-93.ap-south-1.compute.amazonaws.com:/etc/systemd/system

# Start the caddy server (Run on the server)
sudo systemctl daemon-reload
sudo systemctl enable caddy
sudo systemctl start caddy

# Start the backend service (Run on the server)
sudo systemctl daemon-reload
sudo systemctl enable bizmateapi
sudo systemctl start bizmateapi


# Other tasks
# handle the database migrations
