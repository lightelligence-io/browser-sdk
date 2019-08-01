#!/bin/bash

if [[ $TRAVIS_COMMIT_MESSAGE =~ ^release ]]; then
  git config --local user.name "lightelligence-bot"
  git config --local user.email "support@lightelligence.io"
  export TRAVIS_TAG=$(node -p "require('./package.json').version")
fi

