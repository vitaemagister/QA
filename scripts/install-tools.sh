#!/bin/bash

echo "=== QA Tools Installer ==="

# --- STEP 1: API TOOLS ---
echo "Step 1: Choose API tools to install (separate numbers with space):"
echo "1) Postman"
echo "2) Insomnia"
echo "3) Bruno"
echo "4) All"
read -p "Your choice: " api_choices

# --- STEP 2: BROWSERS ---
echo "Step 2: Choose browsers to install (separate numbers with space):"
echo "1) Google Chrome"
echo "2) Firefox"
echo "3) Brave"
echo "4) All"
read -p "Your choice: " browser_choices

# --- UPDATE SYSTEM ---
echo "🚀 Updating system..."
sudo apt update && sudo apt upgrade -y

# --- INSTALL FUNCTIONS ---
install_postman() {
    echo "📦 Installing Postman..."
    sudo snap install postman
}

install_insomnia() {
    echo "📦 Installing Insomnia..."
    sudo snap install insomnia
}

install_bruno() {
    echo "📦 Installing Bruno..."
    sudo snap install bruno
}

install_chrome() {
    echo "🌐 Installing Google Chrome..."
    wget -q https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
    sudo apt install -y ./google-chrome-stable_current_amd64.deb
    rm google-chrome-stable_current_amd64.deb
}

install_firefox() {
    echo "🌐 Installing Firefox..."
    sudo apt install -y firefox
}

install_brave() {
    echo "🌐 Installing Brave..."
    sudo apt install -y curl
    sudo curl -fsSLo /usr/share/keyrings/brave-browser-archive-keyring.gpg https://brave-browser-apt-release.s3.brave.com/brave-browser-archive-keyring.gpg
    echo "deb [signed-by=/usr/share/keyrings/brave-browser-archive-keyring.gpg] https://brave-browser-apt-release.s3.brave.com/ stable main" | sudo tee /etc/apt/sources.list.d/brave-browser-release.list
    sudo apt update
    sudo apt install -y brave-browser
}

# --- STEP 3: INSTALL SELECTED TOOLS ---

echo "⚙️ Installing selected tools..."

# API TOOLS
for choice in $api_choices; do
    case $choice in
        1) install_postman ;;
        2) install_insomnia ;;
        3) install_bruno ;;
        4)
            install_postman
            install_insomnia
            install_bruno
            break
            ;;
        *) echo "❌ Invalid API tool choice: $choice" ;;
    esac
done

# BROWSERS
for choice in $browser_choices; do
    case $choice in
        1) install_chrome ;;
        2) install_firefox ;;
        3) install_brave ;;
        4)
            install_chrome
            install_firefox
            install_brave
            break
            ;;
        *) echo "❌ Invalid browser choice: $choice" ;;
    esac
done

echo "✅ Installation finished."
