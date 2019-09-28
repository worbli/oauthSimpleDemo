#!/bin/bash

apt update
apt upgrade
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
apt-get install gcc g++ make
curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
apt-get update && apt-get install yarn
apt install docker.io
