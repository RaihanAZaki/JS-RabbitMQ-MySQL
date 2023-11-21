# Base image
FROM ubuntu:latest

# Install necessary packages
RUN apt-get update && \
    apt-get install -y rabbitmq-server mysql-client php apache2 && \
    rm -rf /var/lib/apt/lists/*

# Configure RabbitMQ
# (Add any RabbitMQ configurations if needed)

# Configure MySQL (replace with your specific configurations)
COPY my.cnf /etc/mysql/my.cnf

# Configure PHP and Apache for phpMyAdmin
# (Add any phpMyAdmin configurations if needed)

# Expose ports for RabbitMQ, MySQL, and phpMyAdmin
EXPOSE 5672 15672 3306 80

# Start RabbitMQ, MySQL, and Apache services
CMD service rabbitmq-server start && service mysql start && service apache2 start
