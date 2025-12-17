pipeline {
    agent any

    stages {
        
        stage('Build') {
            steps {
                sh 'docker compose build --no-cache'
            }
        }
        
        stage('Test') {
            steps {
                // Run the test service and exit with its code
                // When the test container finishes, it exits, and that exit event triggers --abort-on-container-exit, which stops all other containers.
                // --exit-code-from test ensures Jenkins uses the test container’s result to mark the pipeline as success or failure.
                sh 'docker compose up --abort-on-container-exit --exit-code-from test'
            }
        }

        stage('Deploy') {
            steps {
                script {
                   echo 'Deploying application...'

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
             emailext(
                to: 'karenibrahim76@gmail.com',
                subject: "Jenkins Build: ${currentBuild.fullDisplayName} (${currentBuild.currentResult})",
                mimeType: 'text/html',
                body: """
                    <h2>Build Details</h2>
                    <ul>
                    <li>Project: ${env.JOB_NAME}</li>
                    <li>Build Number: ${env.BUILD_NUMBER}</li>
                    <li>Status: ${currentBuild.currentResult}</li>
                    <li>URL: <a href='${env.BUILD_URL}'>${env.BUILD_URL}</a></li>
                    <li>Started by: ${currentBuild.getBuildCauses()[0]?.userName ?: 'SCM/Timer'}</li>
                    </ul>

                    <h3>Changes Since Last Build:</h3>
                    <ul>
                    ${currentBuild.changeSets.collect { cs -> 
                        cs.items.collect { "<li>${it.commitId} - ${it.msg} by ${it.author}</li>" }.join("")
                    }.join("")}
                    </ul>

                    <h3>Console Output:</h3>
                    <a href='${env.BUILD_URL}console'>View Full Console</a>
                    """
                        )
                } 
        success {
            echo 'SUCCESS: Pipeline executed successfully.'
        }
        failure {
            echo 'FAILURE: Pipeline failed.'
            
        }
    }
}
