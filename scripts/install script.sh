#!/bin/bash

# Визначення дистрибутива
if command -v apt >/dev/null 2>&1; then
    PKG_MANAGER="apt"
elif command -v pacman >/dev/null 2>&1; then
    PKG_MANAGER="pacman"
else
    echo "Невідомий пакетний менеджер. Встанови вручну."
    exit 1
fi

# Ставимо flatpak
if [ "$PKG_MANAGER" = "apt" ]; then
    sudo apt update && sudo apt install -y flatpak
elif [ "$PKG_MANAGER" = "pacman" ]; then
    sudo pacman -Syu --noconfirm flatpak
fi

# Додаємо Flathub
flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo

# Docker спочатку
if [ "$PKG_MANAGER" = "apt" ]; then
    sudo apt install -y docker.io docker-compose
elif [ "$PKG_MANAGER" = "pacman" ]; then
    sudo pacman -S --noconfirm docker docker-compose
fi

# Ставимо інші програми з Flathub
flatpak install -y flathub \
    com.brave.Browser \
    com.google.Chrome \
    com.visualstudio.code \
    com.microsoft.Edge \
    com.spotify.Client \
    com.getpostman.Postman \
    com.slack.Slack \
    com.microsoft.Teams \
    com.protonvpn.www \
    org.mozilla.Thunderbird \
    io.github.whaler_software.Whaler

echo "✅ Встановлення завершено!"
