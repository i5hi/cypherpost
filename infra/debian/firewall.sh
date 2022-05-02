#!/bin/bash

# sudo nano /etc/default/ufw
# Confirm that IPV6 is set to yes:

sudo ufw default deny incoming
sudo ufw default allow outgoing
# sudo ufw allow ssh
# nondefaultssh
sudo ufw allow 2122/tcp
sudo ufw allow 80/tcp
# sudo ufw allow from your_server_ip