#!/bin/bash

curl -fsSL https://ollama.com/install.sh | sh

export PATH=$PATH:/usr/local/bin

ollama pull mistral

sudo systemctl enable ollama

sudo systemctl start ollama


