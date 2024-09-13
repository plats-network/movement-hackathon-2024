#!/bin/bash
rm -rf tf_state
rm -rf tf_state.tar.gz

for dir in ./environments/*; do
    echo "exporting $dir";
    folder_name=$(basename "$dir")
    # init folder
    mkdir -p tf_state
    mkdir -p tf_state/$folder_name
    # copy content
    cp "$dir/config.tfvars" "tf_state/$folder_name/" 2>/dev/null
    cp -r "$dir/local_state/" "tf_state/$folder_name/local_state" 2>/dev/null
done

mkdir tf_state/vpn-identity
cp -r "./vpn-identity/" "tf_state/vpn-identity/" 2>/dev/null

tar -czvf tf_state.tar.gz tf_state
rm -rf tf_state 

# Output the result
echo "Files have been copied and compressed into tf_state.tar.gz"