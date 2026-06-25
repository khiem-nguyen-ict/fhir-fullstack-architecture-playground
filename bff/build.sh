#!/bin/sh

# Fix the issue for render.com

if [ -n "$PATIENT_SERVICE_URL" ] && ! echo "$PATIENT_SERVICE_URL" | grep -q '^http'; then
    CONVERTED_URL="https://${PATIENT_SERVICE_URL}.onrender.com"
    echo "Converting PATIENT_SERVICE_URL: $PATIENT_SERVICE_URL -> $CONVERTED_URL"
    export PATIENT_SERVICE_URL="${CONVERTED_URL}"
fi

exec "$@"
