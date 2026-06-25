#!/bin/sh

# Transform SPRING_DATASOURCE_URL from Render format to JDBC format
# Render format: postgresql://user:pass@host/db
# JDBC format:   jdbc:postgresql://host/db

if [ -n "$SPRING_DATASOURCE_URL" ] && echo "$SPRING_DATASOURCE_URL" | grep -q '@' && ! echo "$SPRING_DATASOURCE_URL" | grep -q '^jdbc:'; then
    CONVERTED_URL="jdbc:postgresql://$(echo "$SPRING_DATASOURCE_URL" | sed 's/.*@//')"
    echo "Converting SPRING_DATASOURCE_URL: $SPRING_DATASOURCE_URL -> $CONVERTED_URL"
    export SPRING_DATASOURCE_URL="${CONVERTED_URL}"
fi

exec java -jar /app/app.jar --server.port="${PORT:-8081}" "$@"