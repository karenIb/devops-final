# Full path /mnt/c/Users/masso/OneDrive/Desktop/devops-final/docker/jenkins-build
FROM jenkins/jenkins:lts

# Switch to root to install packages
USER root

# Install Docker CLI inside the container
RUN apt-get update && \
    apt-get install -y docker.io && \
    rm -rf /var/lib/apt/lists/*

# Install Docker Compose v2 plugin
RUN mkdir -p /usr/lib/docker/cli-plugins && \
    curl -SL https://github.com/docker/compose/releases/download/v2.24.7/docker-compose-linux-x86_64 \
      -o /usr/lib/docker/cli-plugins/docker-compose && \
    chmod +x /usr/lib/docker/cli-plugins/docker-compose

# (Optional) run Jenkins as root so it can use /var/run/docker.sock easily
# This is simpler for learning environments
USER root