pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                sh 'docker compose build'
            }
        }
        
        stage('Test') {
            steps {
                // Run the test service and exit with its code
                // --abort-on-container-exit stops other containers if one stops (useful if test finishes)
                // --exit-code-from test ensures jenkins gets the exit code of test container
                sh 'docker compose up --abort-on-container-exit --exit-code-from test'
            }
        }

        stage('Deploy') {
            steps {
                script {
                   echo 'Deploying application...'
                   // In a real scenario, this would deploy to a production server.
                   // Here we are simulating deployment by keeping the services running if needed,
                   // but since we tore them down after test (or will tear down), 
                   // we can restart the web service in detached mode for "production" usage.
                   
                   // Clean up the test run
                   sh 'docker compose down'
                   
                   // Start the web and db services in detached mode
                   sh 'docker compose up -d web db'
                   echo 'Deployment complete. Application is running on port 80.'
                }
            }
        }
    }

    post {
        always {
             echo 'Pipeline finished.'
        }
        success {
            echo 'SUCCESS: Pipeline executed successfully.'
            // Using mailer plugin if configured, or just echo for now
            // mail to: 'developer@example.com', subject: 'Build Success', body: "Build ${env.BUILD_NUMBER} passed tests."
        }
        failure {
            echo 'FAILURE: Pipeline failed.'
            sh 'docker compose down' 
        }
    }
}
