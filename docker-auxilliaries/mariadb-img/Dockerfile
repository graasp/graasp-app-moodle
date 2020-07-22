FROM 'bitnami/mariadb:10.1'

COPY ./mdl_db_dump.sql /docker-entrypoint-initdb.d/


# Define the healthcheck measure
HEALTHCHECK --interval=1m --timeout=30s --retries=30 \
  CMD curl --fail http://localhost:3306 || exit 1
