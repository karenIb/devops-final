To run a Jenkins container with persistent data storage and the ability to interact with the Docker daemon on the host, you can use the docker run command with volume and Docker socket mounting.
Here is the command:
Code

```
docker run -d -p 8080:8080 -p 50000:50000   --name jenkins   -v jenkins_home:/var/jenkins_home   --restart always -v /var/run/docker.sock:/var/run/docker.sock   jenkins-with-docker
```
Explanation of the command:
-d: Runs the container in detached mode (in the background).
-p 8080:8080: Maps port 8080 of the host to port 8080 inside the container, allowing access to the Jenkins web interface.
-p 50000:50000: Maps port 50000 of the host to port 50000 inside the container, used for Jenkins agents.
-v jenkins_home:/var/jenkins_home: This creates a named Docker volume called jenkins_home and mounts it to /var/jenkins_home inside the container. This ensures that all Jenkins data (configurations, jobs, plugins, etc.) persists even if the container is removed or recreated.
-v /var/run/docker.sock:/var/run/docker.sock: This bind-mounts the Docker daemon socket from the host machine into the Jenkins container. This allows the Jenkins container to execute Docker commands (like docker build, docker run) directly on the host's Docker daemon, effectively enabling "Docker in Docker" functionality for Jenkins builds.
--name jenkins: Assigns the name jenkins to the container for easy identification and management.
jenkins/jenkins:lts: Specifies the Docker image to use, in this case, the official Jenkins LTS image.
After running this command, Jenkins will be accessible on http://localhost:8080, and it will be configured to persist its data and interact with the host's Docker daemon.