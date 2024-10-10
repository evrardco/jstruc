ARG dev=0
FROM node:22-bookworm
COPY src /var/jstruc
RUN \
    if [ "$dev" = "1" ]; then \
        rm -rf /var/jstruc && \
        ln -s /var/volume /var/jstruc; \
    else \
        cd /var/jstruc && npm i; \
    fi
CMD [ "npm", "start" ]

