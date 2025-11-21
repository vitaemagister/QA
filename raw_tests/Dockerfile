FROM ubuntu:22.04

# Avoid prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Set display environment variable
ENV DISPLAY=:1
ENV VNC_RESOLUTION=1920x1080

# Install essential packages, desktop environment, and VNC server
RUN apt-get update && apt-get install -y \
    xfce4 \
    xfce4-goodies \
    tigervnc-standalone-server \
    tigervnc-common \
    novnc \
    python3-websockify \
    python3-numpy \
    supervisor \
    software-properties-common \
    dbus-x11 \
    x11-xserver-utils \
    xfonts-base \
    wget \
    curl \
    git \
    vim \
    nano \
    chromium-browser \
    net-tools \
    sudo \
    snapd \
    kazam \
    flameshot \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Firefox from Mozilla PPA
RUN add-apt-repository ppa:mozillateam/ppa -y && \
    apt install firefox -y

# Install Postman via snap (runs as root, then accessible to all users)
RUN service snapd start || true && \
    snap install postman || true

# Create qauser with sudo privileges
RUN useradd -m -s /bin/bash -G sudo qauser && \
    echo "qauser:password" | chpasswd && \
    echo "qauser ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# Switch to qauser
USER qauser
WORKDIR /home/qauser

# Create VNC directory and set password for qauser
RUN mkdir -p /home/qauser/.vnc
RUN echo "password" | vncpasswd -f > /home/qauser/.vnc/passwd
RUN chmod 600 /home/qauser/.vnc/passwd

# Create xstartup file for VNC
RUN echo '#!/bin/sh\n\
unset SESSION_MANAGER\n\
unset DBUS_SESSION_BUS_ADDRESS\n\
export XKL_XMODMAP_DISABLE=1\n\
exec startxfce4' > /home/qauser/.vnc/xstartup && \
    chmod +x /home/qauser/.vnc/xstartup

# Switch back to root for supervisor setup
USER root

# Create startup script
RUN echo '#!/bin/bash\n\
# Kill any existing VNC servers\n\
su - qauser -c "vncserver -kill :1 2>/dev/null || true"\n\
# Start VNC server as qauser\n\
su - qauser -c "vncserver :1 -geometry $VNC_RESOLUTION -depth 24 -localhost no"\n\
# Start noVNC\n\
/usr/share/novnc/utils/launch.sh --vnc localhost:5901 --listen 6080' > /root/start.sh && \
    chmod +x /root/start.sh

# Create supervisor configuration
RUN mkdir -p /var/log/supervisor && \
    echo '[supervisord]' > /etc/supervisor/conf.d/supervisord.conf && \
    echo 'nodaemon=true' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo 'user=root' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo '' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo '[program:desktop]' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo 'command=/root/start.sh' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo 'autorestart=true' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo 'stdout_logfile=/var/log/supervisor/desktop.log' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo 'stderr_logfile=/var/log/supervisor/desktop_error.log' >> /etc/supervisor/conf.d/supervisord.conf

# Expose VNC and noVNC ports
EXPOSE 5901 6080

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]