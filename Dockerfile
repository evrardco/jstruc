FROM node:22-bookworm
ARG dev=0
COPY src /var/jstruc
ENV SERVER_IP=127.0.0.1
ENV SERVER_PORT=8000
ENV MULTIPLAYER=false
RUN \
    if [ "$dev" = "1" ]; then \
        rm -rf /var/jstruc && \
        ln -s /var/volume /var/jstruc && \
        echo "DEV MODE ACTIVE"; \
    else \
        cd /var/jstruc && npm i && \
        echo "DEV MODE INACTIVE"; \
    fi
RUN \
    echo "cd /var/jstruc && npm run start" > /usr/bin/run_server.sh && \
    chmod +x /usr/bin/run_server.sh
CMD [ "npm", "start" ]

