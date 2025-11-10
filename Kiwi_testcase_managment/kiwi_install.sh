#!/bin/bash

# Automated installation script for Kiwi TCMS
# For Linux systems

set -e  # Stop execution on error

echo "=================================="
echo "Kiwi TCMS Installation"
echo "=================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed!"
    echo "Install Docker: https://docs.docker.com/engine/install/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker compose &> /dev/null; then
    echo "❌ Docker Compose is not installed!"
    echo "Install Docker Compose: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker is installed"
echo "✅ Docker Compose is installed"
echo ""

# Ask user for domain name
read -p "Enter domain name (default: localhost): " DOMAIN
DOMAIN=${DOMAIN:-localhost}

echo ""
echo "Using domain: $DOMAIN"
echo ""

# Create working directory
WORK_DIR="$HOME/kiwi-tcms"
echo "Creating working directory: $WORK_DIR"
mkdir -p "$WORK_DIR"
cd "$WORK_DIR"

# Download docker-compose.yml
echo "Downloading configuration..."
if [ -d "Kiwi" ]; then
    echo "Repository already exists, updating..."
    cd Kiwi
    git pull
else
    echo "Cloning repository..."
    git clone https://github.com/kiwitcms/Kiwi.git
    cd Kiwi
fi

echo ""
echo "Starting Docker containers..."
docker compose up -d

echo ""
echo "Waiting for containers to start (30 seconds)..."
sleep 30

echo ""
echo "Running database migrations..."
docker exec -t kiwi_web /Kiwi/manage.py migrate

echo ""
echo "Setting domain configuration..."
docker exec -t kiwi_web /Kiwi/manage.py set_domain "$DOMAIN"

echo ""
echo "=================================="
echo "Creating superuser account"
echo "=================================="
echo ""
docker exec -it kiwi_web /Kiwi/manage.py createsuperuser

echo ""
echo "=================================="
echo "✅ Kiwi TCMS installed successfully!"
echo "=================================="
echo ""
echo "🌐 Open in browser: https://$DOMAIN"
echo ""
echo "⚠️  You will see a security warning (self-signed certificate)"
echo "    This is normal for local usage."
echo ""
echo "📝 Login with the credentials you just created"
echo ""
echo "Useful commands:"
echo "  Stop:    cd $WORK_DIR/Kiwi && docker compose stop"
echo "  Start:   cd $WORK_DIR/Kiwi && docker compose start"
echo "  Remove:  cd $WORK_DIR/Kiwi && docker compose down"
echo "  Logs:    cd $WORK_DIR/Kiwi && docker compose logs -f"
echo ""