FROM ghcr.io/berriai/litellm:v1.86.2

COPY config.yaml /app/proxy_server_config.yaml

CMD ["--config", "/app/proxy_server_config.yaml", "--port", "4000"]