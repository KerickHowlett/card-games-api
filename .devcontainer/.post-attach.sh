#!/usr/bin/env bash

INSTALL_FLAGS=""
if [[ "${#$(find '/workspace/node_modules/' -maxdepth 1)[@]}" == "0" ]]; then
    INSTALL_FLAGS="--frozen-lockfile"
fi

yarn install ${INSTALL_FLAGS}

sudo chown --from=root -Rc node:node /workspace/node_modules
