#!/bin/env bash
set -x
docker_id=$(docker build . --progress=plain --build-arg dev=1 2>&1 | tee dev_log.txt | tail -n 1)
cat dev_log.txt
rm dev_log.txt
echo docker_id=$docker_id
docker run -it -p 8081:8000/tcp -v $(pwd)/src:/var/volume --entrypoint=/bin/bash $docker_id 
