#!/bin/bash

# Перевірити чи вже встановлена LM Studio
# Check if LM Studio is already installed
if [ ! -f /opt/lm-studio ]; then
    # Завантажити та встановити LM Studio (GUI додаток)
    # Download and install LM Studio (GUI application)
    wget -q -O /tmp/lm-studio.AppImage https://lmstudio.ai/download/latest/linux/x64 2>/dev/null
    chmod +x /tmp/lm-studio.AppImage
    sudo mv /tmp/lm-studio.AppImage /opt/lm-studio 2>/dev/null
    sudo chmod +x /opt/lm-studio 2>/dev/null
    
    # Створити ярлик на робочому столі
    # Create desktop shortcut
    mkdir -p ~/.local/share/applications
    cat > ~/.local/share/applications/lm-studio.desktop << EOF
[Desktop Entry]
Type=Application
Name=LM Studio
Exec=/opt/lm-studio
Icon=application-x-executable
Terminal=false
Categories=Development;
EOF
fi

# Запустити програму в фоні і закрити термінал
# Launch application in background and close terminal
nohup /opt/lm-studio > /dev/null 2>&1 &
exit 0