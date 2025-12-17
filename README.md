# CI/CD DevOps Project Documentation

This document provides a comprehensive overview of the project's structure, the detailed purpose of each file, and an in-depth explanation of the CI/CD pipeline architecture involving GitHub, Jenkins, and Ngrok.

## 1. Project Structure

The project follows a modular structure to separate application code, Docker configurations, and CI/CD logic.

```
.
├── src/                    # The core application source code.
│   └── index.php           # Simple PHP entry point illustrating the web app.
├── docker/                 # Container definitions for different services.
│   ├── php/                # PHP service configuration.
│   │   └── Dockerfile      # Builds the PHP image with required extensions.
│   ├── mysql/              # Database service configuration.
│   │   ├── Dockerfile      # Custom MySQL image setup.
│   │   └── key-init.sh     # Initialization script for database keys/setup.
│   └── node/               # Node.js service for testing.
│       ├── Dockerfile      # Builds the test runner image.
│       └── test.js         # Test script to validate the application.
├── docker-compose.yaml     # Orchestrator defining how all services run together.
├── Jenkinsfile             # Defining the detailed CI/CD pipeline logic.
├── jenkins-run.sh          # Helper script to bootstrap the Jenkins environment.
└── README.md               # This documentation file.
```
 
---

## 2. File Elaboration

### **Jenkinsfile** (Critical Component)
The `Jenkinsfile` is the heart of our automation. It defines the **Pipeline** that Jenkins executes. It triggers on Git events (Push/PR) and runs the following stages:

*   **Pipeline Definition**: Uses `pipeline { agent any ... }` to run on any available Jenkins agent.
*   **Stages**:
    1.  **Build**: Runs `docker compose build --no-cache`. This ensures we build fresh images for PHP, MySQL, and Node.js every time to catch environment issues early.
    2.  **Test**: Runs `docker compose up --abort-on-container-exit --exit-code-from test`.
        *   This spins up the stack.
        *   The `test` container (Node.js) runs scripts against the `web` container.
        *   `--abort-on-container-exit`: If the test container finishes (pass or fail), the entire stack shuts down.
        *   `--exit-code-from test`: Jenkins uses the exit code of the test container to determine if this pipeline stage passed or failed.
    3.  **Deploy**: 
        *   Executed only if tests pass.
        *   Runs `docker compose down` to clean up the test environment.
        *   Runs `docker compose up -d web db` to launch the actual application services in detached mode, simulating a deployment to a "production-like" state on port 80.
*   **Post Actions**:
    *   **Always**: Sends an email notification to the administrator with build details (Status, Build #, Changeset) regardless of success or failure.
    *   **Failure**: Ensures cleanup (`docker compose down`) if the pipeline crashes.

### Other Key Files
*   **docker-compose.yaml**: Defines services (`web`, `db`, `test`). It sets up networking so the `test` service can talk to `web` via hostname `web` inside the Docker network.
*   **jenkins-run.sh**: A shell script to start the Jenkins container itself. It mounts the host's Docker socket (`/var/run/docker.sock`) into the Jenkins container. This allows Jenkins (running inside a container) to spawn sibling containers for the build process (Docker-in-Docker / Docker-outside-of-Docker pattern).

---

## 3. Infrastructure & CI/CD Setup

This project uses a robust CI/CD workflow designed to expose a local development environment to the public internet for GitHub integration.

### **1. GitHub & Private Repository**
The code is hosted on a **Private GitHub Repository**.
*   **Remote**: `git remote -v` will show the private repo URL.
*   **Triggers**: The repository is configured with a **Webhook**.
*   **Permissions**: Using a private key or personal access token credential in Jenkins allows it to pull this private code.

### **2. Ngrok for Webhooks**
Since Jenkins is running on `localhost:8080`, GitHub servers cannot reach it directly to deliver webhook events (like "Push" or "Pull Request" notifications).
*   **Solution**: **Ngrok** is best used to create a secure tunnel.
*   **URL**: `https://incorporeal-sheba-unresentfully.ngrok-free.dev`
*   **Configuration**: This URL is added to the GitHub repository's Webhook settings with the payload URL:
    `https://incorporeal-sheba-unresentfully.ngrok-free.dev/github-webhook/`
    *(Note the `/github-webhook/` endpoint which Jenkins listens on)*.

### **3. Jenkins Multibranch Pipeline**
We deliberately chose a **Multibranch Pipeline** project type in Jenkins over a standard (General) Pipeline.

**Why Multibranch?**
1.  **Smart Triggering**: A general pipeline configured with a webhook might trigger on *any* push to *any* branch indiscriminately. A Multibranch pipeline automatically discovers branches (main, feature/*, PRs) and creates sub-jobs for them.
2.  **Pull Request vs. Push Logic**: 
    *   **Push to `main`**: Triggers a deployment flow.
    *   **Pull Request**: Can trigger a specific "Merge Request" build to verify code *before* it lands in main.
    *   This separation allows different behaviors (e.g., only deploy on merge to main, just test on PRs) if we add conditional logic in the future.
3.  **Visualization**: It provides a clean folder view in Jenkins where you can see the build status of every active branch separately.

---

## 4. The CI/CD Flow

Here is the lifecycle of a code change:

1.  **Code Change**: You modify code locally and `git push` to the private GitHub repository.
2.  **Webhook Event**: GitHub sends a JSON payload to `https://incorporeal-sheba-unresentfully.ngrok-free.dev/github-webhook/`.
3.  **Tunneling**: Ngrok forwards this request to your local Jenkins instance running on port 8080.
4.  **Jenkins Trigger**: 
    *   The Multibranch Pipeline receives the hook.
    *   It scans the repo to see which branch was updated.
    *   It triggers a build for that specific branch's job.
5.  **Pipeline Execution**:
    *   **Checkout**: Jenkins pulls the latest code.
    *   **Build**: Docker images are rebuilt.
    *   **Test**: The `test` container runs verification scripts.
    *   **Deploy**: If successful, the app is re-deployed locally.
6.  **Notification**: Jenkins sends an HTML email report to the developer with the build status and logs.

---
