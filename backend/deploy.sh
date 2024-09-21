#!/bin/bash

# Install caddy server (Run on the server)
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy

# Copy the required files (Run locally)
scp -i bizmate.pem -r ./bin/backend ubuntu@ec2-13-126-206-180.ap-south-1.compute.amazonaws.com:/home/ubuntu/app
scp -i bizmate.pem -r ./public ubuntu@ec2-13-126-206-180.ap-south-1.compute.amazonaws.com:/home/ubuntu/app/public
scp -i bizmate.pem -r ./i18n ubuntu@ec2-13-126-206-180.ap-south-1.compute.amazonaws.com:/home/ubuntu/app/i18n
scp -i bizmate.pem -r ./Caddyfile ubuntu@ec2-13-126-206-180.ap-south-1.compute.amazonaws.com:/etc/caady
scp -i bizmate.pem -r ./bizmateapi.service ubuntu@ec2-13-126-206-180.ap-south-1.compute.amazonaws.com:/etc/systemd/system
scp -i bizmate.pem -r ./.env.prod ubuntu@ec2-13-126-206-180.ap-south-1.compute.amazonaws.com:/home/ubuntu/app/.env.local

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
