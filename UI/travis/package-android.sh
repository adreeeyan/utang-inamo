#!/bin/bash -v

set -e

if [[ "$TRAVIS_BRANCH" == "develop" ]]
then
    echo "Skipping package Android for develop branch"
    exit
fi

if [[ "$2" == "crosswalk" ]]
then
    echo "Packaging app with crosswalk..."
    appname=UtangInamo_crosswalk.apk
else
    echo "Packaging app..."
    appname=UtangInamo.apk
fi

mkdir -p output
cp platforms/android/build/outputs/apk/android-release-unsigned.apk output/utanginamo-release-unsigned.apk

echo "Signing the apk"
#sign the apk
export zippath="$(find $ANDROID_HOME -name zipalign -print -quit)"
echo $zippath
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore -storepass $1 output/utanginamo-release-unsigned.apk utang-inamo
$zippath -v 4 output/utanginamo-release-unsigned.apk output/$appname

echo "Deleting the unsigned apk"
#remove the unsigned
rm output/utanginamo-release-unsigned.apk