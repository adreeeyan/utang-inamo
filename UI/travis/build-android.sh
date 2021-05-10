#!/bin/bash -v

set -e

if [[ "$1" == "crosswalk" ]]
then
    echo "Building apk with crosswalk..."
    rm config.xml
    mv config_crosswalk.xml config.xml
else
    echo "Building apk..."
    ionic cordova platforms add android --save
fi

if [[ "$TRAVIS_BRANCH" == "develop" ]]
then
    ionic cordova build android -enableLint false
else
    ionic cordova build android --prod --release -enableLint false
fi
