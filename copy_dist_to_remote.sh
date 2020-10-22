#!/bin/bash
set -e
# Change to name used in your .ssh/config
REMOTE_SERVER="vps08.cloud.studioavw.nl"
if [ "$1" != "" ]; then
    REMOTE_SERVER=$1
fi

# ---------------------------------
# Get current remote version
SERVER_VERSION=$(ssh -q "$REMOTE_SERVER" "ls -r /home/buoyancy/app | grep -E '^[0-9]+' | head -1 | sed -e 's/\r//g'" );
yan
CURRENT_VERSION=$(cat VERSION);
NEW_VERSION="${CURRENT_VERSION%.*}.$((${CURRENT_VERSION##*.}+1))";
echo "Version on server is $SERVER_VERSION. Version in repository is $CURRENT_VERSION so bump to $NEW_VERSION"
read -p "Are you sure you want to publish a new version to server $REMOTE_SERVER? [Yn]" -n 1 -r
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    exit 1
fi

if [[ $(git diff --stat) != '' ]]; then
    echo "\n"
    read -p "The git repository has uncommitted changes, are you sure you want to publish a new version? [Yn]" -n 1 -r
    if [[ ! $REPLY =~ ^[Yy]$ ]]
    then
        exit 1
    fi
fi
echo "\n"
echo $NEW_VERSION > VERSION
git commit VERSION -m "release($NEW_VERSION): updated version"
git tag $NEW_VERSION

# Possibly include npm run build, if you wish to include the version of $NEW_VERSION in some scripts of the build itself (like a config)
# npm run build

# Rsync our local version over
rsync -rpv --rsync-path="sudo rsync" dist/* $REMOTE_SERVER:/home/buoyancy/app/$NEW_VERSION
read -p "\nDo you wish to enable $NEW_VERSION on $REMOTE_SERVER? [Yn]" -n 1 -r
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    exit 1
fi

ssh -q $REMOTE_SERVER "sudo ln -sfn $NEW_VERSION /home/buoyancy/app/latest"
echo "All done!"
