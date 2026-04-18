pipeline {
    agent any

    environment {
        APP_NAME = 'blog-app'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    echo 'Building Backend Image...'
                    sh 'docker build -t ${APP_NAME}-backend ./backend'
                    
                    echo 'Building Frontend Image...'
                    sh 'docker build -t ${APP_NAME}-frontend ./frontend'
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                script {
                    // This deployment runs locally on the Jenkins agent (EC2 instance)
                    // If Jenkins is on a separate instance, you would use SSH here (`ssh user@ec2-ip 'docker run...'`)
                    
                    // Stop & Remove existing containers (if any)
                    sh "docker rm -f ${APP_NAME}-backend || true"
                    sh "docker rm -f ${APP_NAME}-frontend || true"

                    // Create a custom docker network for the app components to communicate internally if needed
                    sh "docker network create ${APP_NAME}-network || true"

                    // Start Backend Container
                    sh "docker run -d --name ${APP_NAME}-backend --network ${APP_NAME}-network -p 5000:5000 ${APP_NAME}-backend"

                    // Start Frontend Container
                    sh "docker run -d --name ${APP_NAME}-frontend --network ${APP_NAME}-network -p 80:80 ${APP_NAME}-frontend"
                }
            }
        }
    }

    post {
        always {
            echo 'Deployment step finished!'
            // To prevent the EC2 instance from running out of disk space, prune old dangling images
            sh 'docker image prune -f'
        }
        success {
            echo 'Successfully built and deployed new containers!'
        }
        failure {
            echo 'Pipeline failed. Check the logs.'
        }
    }
}
