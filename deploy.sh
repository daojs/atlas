#!/bin/sh

git checkout -- ./cache
git pull
yarn
yarn run build
forever restartall