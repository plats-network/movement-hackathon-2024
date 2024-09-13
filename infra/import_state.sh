#!/bin/bash
CURRENT_LOCATION=$(pwd)
rm -rf tf_state
tar -xzvf tf_state.tar.gz

for dir in ./tf_state/*; do
    if [ "$dir" == "./tf_state/vpn-identity" ]; then
        rm -rf $CURRENT_LOCATION/vpn-identity
        mkdir $CURRENT_LOCATION/vpn-identity
        cp -rf "$dir/" "$CURRENT_LOCATION/vpn-identity"
        continue;
    fi
    echo "importing $dir";
    folder_name=$(basename "$dir")
    # copy content
    cp -rf "$dir/" "./environments/$folder_name"  #2>/dev/null
done

rm -rf tf_state