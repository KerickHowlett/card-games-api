#!/usr/bin/env bash

sudo chown --from=root -Rc node:node /workspace/node_modules
npm install -g @nrwl/cli
sudo chown --from=root -Rc node:node /workspace/node_modules
