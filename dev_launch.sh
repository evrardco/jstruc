#!/bin/env bash
set -x
docker_id=$(docker build . --progress=plain --build-arg dev=1 2>&1 | tee dev_log.txt | tail -n 1)
cat dev_log.txt
rm dev_log.txt
echo docker_id=$docker_id
docker run -it -p 8080:80/tcp -v $(pwd)/src:/var/src --entrypoint=/bin/bash $docker_id 
