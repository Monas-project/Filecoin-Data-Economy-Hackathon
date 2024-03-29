#!/bin/sh
# IPFSサービスが起動するまで待つ
while ! nc -z ipfs 5001; do   
  echo "Waiting for IPFS to be ready..."
  sleep 1
done
echo "IPFS is up and running!"