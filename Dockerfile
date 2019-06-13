FROM nginxinc/nginx-unprivileged:stable

# Copy assets over
# NOTE: These have to be built first with "npm run build"
COPY docs /usr/share/nginx/html/browser-sdk
