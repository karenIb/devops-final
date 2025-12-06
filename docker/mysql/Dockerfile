FROM mysql:5.7
ENV MYSQL_DATABASE=app_db
ENV MYSQL_USER=user
ENV MYSQL_PASSWORD=password
ENV MYSQL_ROOT_PASSWORD=root_password
COPY init.sql /docker-entrypoint-initdb.d/
