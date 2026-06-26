#!/bin/sh

if [ -n "$RENDER_BFF_HOST" ]; then
  BFF_URL="https://${RENDER_BFF_HOST}.onrender.com"
fi

echo "RUNTIME BFF_URL: ${BFF_URL}"

# Replace the placeholder in index.html with the actual BFF_URL
sed "s|/\*\*BFF_URL_INJECTION\*/|window.__BFF_URL__ = \"${BFF_URL}\";|g" dist/index.html > dist/index.html.tmp && mv dist/index.html.tmp dist/index.html