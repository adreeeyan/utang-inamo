#!/bin/bash -v

set -e

# Build Ionic App for iOS
cordova platform add ios --nofetch

if [[ "$TRAVIS_BRANCH" == "develop" ]]
then
    ionic cordova build ios -enableLint false
else
    ionic cordova build ios --prod --release -enableLint false
fi
