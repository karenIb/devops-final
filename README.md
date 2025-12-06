# CI/CD DevOps Project

This project demonstrates a complete CI/CD pipeline using Docker, Docker Compose, Jenkins, PHP, MySQL, and Node.js.

## Project Structure

```
.
├── src/                # PHP Application Source Code
├── docker/             # Docker configurations
│   ├── php/            # PHP Dockerfile
│   ├── mysql/          # MySQL Dockerfile & Init Script
│   └── node/           # Node.js Test Runner
├── docker-compose.yaml # Orchestration
├── Jenkinsfile         # Jenkins Pipeline
├── jenkins-run.sh      # Script to start Jenkins
└── README.md           # Documentation
```

## Prerequisites

- **Docker Desktop** installed and running.
- **Git** installed.

## Getting Started

### 1. Start Jenkins

Run the provided script to start Jenkins with Docker socket access (Docker-in-Docker / Docker-outside-of-Docker):

```bash
chmod +x jenkins-run.sh
./jenkins-run.sh
```

- Jenkins will be available at `http://localhost:8080`.
- To get the initial admin password:
  ```bash
  docker exec jenkins-docker cat /var/jenkins_home/secrets/initialAdminPassword
  ```
- Complete the setup wizard (install suggested plugins).
- **Important**: You need to install the **Docker Pipeline** plugin and **Docker** plugin in Jenkins if they are not selected by default, though "Suggested plugins" usually covers what's needed for basic pipeline.

### 2. Configure Jenkins Pipeline

1.  Create a "New Item" from the Jenkins dashboard.
2.  Enter a name (e.g., `devops-pipeline`) and select **Pipeline**.
3.  Scroll down to the **Pipeline** section.
4.  Definition: **Pipeline script from SCM**.
5.  SCM: **Git**.
6.  Repository URL: Use the local path or your git repo url. If running locally with the volume mount as configured in `jenkins-run.sh`, the project is mapped to `/var/jenkins_home/workspace/project`.
    *   *However, for a standard flow*, you would push this code to GitHub and use the GitHub URL.
    *   *For local testing without git push*: You can select **Pipeline script** and copy-paste the content of `Jenkinsfile` into the script box.

### 3. Run the Pipeline

- Click **Build Now**.
- The pipeline will:
    1.  **Build** the Docker images.
    2.  **Test** the application using Node.js.
        - Updates status with success/failure.
    3.  **Deploy**: If tests pass, it restarts the web service.

## Manual Testing

You can also run the environment manually without Jenkins:

```bash
docker-compose up --build
```

- Access the web app at `http://localhost:80`.
- You should see: `Hello world`.
- The `test` service will run, print the result, and exit.

## Running Tests

To run only the tests and exit with a code:

```bash
docker-compose up --abort-on-container-exit --exit-code-from test
```
