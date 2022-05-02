#!/bin/bash

MONTREAL="montreal"

read -p "Enter your LunaNode API ID: " API_ID
read -p "Enter your LunaNode API KEY: " -s API_KEY

BASE_URL="https://dynamic.lunanode.com/api?api_id=$API_ID&api_key=$API_KEY"

function create_volume {
    local region="montreal"
    local category="&category=volume"
    local action="&action=create"
    local prune=$(cat deployment.json | jq -r ".server.bitcoin.prune")
    local size=21
    if [ prune == "false" ]; then
        size=420
    fi
    local label="cypherdata"
    local params="&region=$region&label=$label&size=$size"
    local url="$BASE_URL$category$action$params"

    # echo $url
    local volume_id=$(curl -X POST $url | jq -r ".volume_id")
    echo $volume_id
}

function create_vm {
    local volume_id=$1
    local key_id=$(cat deployment.json | jq -r ".server.provider.ssh_id")
    local region="montreal"
    local category="&category=vm"
    local action="&action=create"
    local host=$(cat deployment.json | jq -r ".server.host")
    local subdomain=$(cat deployment.json | jq -r ".server.subdomain")

    local plan_id=61
    local image_id=240287

    local label="cyphernode"
    local params="&hostname=$subdomain.$host&region=$region&label=$label&plan_id=$plan_id&image_id=$image_id&volume_id=$volume_id&key_id=$key_id"
    local url="$BASE_URL$category$action$params"

    # trace $url
    local vm_id=$(curl -X POST $url | jq -r ".vm_id")
    echo $vm_id

}

function add_dns_zone {
    local category="&category=dns"
    local action="&action=zone-add"
    local host=$(cat deployment.json | jq -r ".server.host")
    local params="&origin=$host&ttl=3600"
    local url="$BASE_URL$category$action$params"

    # trace $url
    curl -X POST $url
    # echo $vm_id
}

function add_dns_record {
    local zone_id=$1
    local ip=$2

    local category="&category=dns"
    local action="&action=record-add"
    local subdomain=$(cat deployment.json | jq -r ".server.subdomain")
    local params="&zone_id=$zone_id&data=$ip&name=$subdomain&ttl=3600&type=A"
    local url="$BASE_URL$category$action$params"

    # trace $url
    curl -X POST $url
    # echo $vm_id
}

function list_volume {
    local category="&category=volume"
    local action="&action=list"
    local url="$BASE_URL$category$action"
    curl -X GET $url | jq

}

function list_dns {
    local dns_zone="&category=dns&action=zone-list"
    local dns_zone_url="$BASE_URL$dns_zone"
    curl -X GET $dns_zone_url | jq
}

function list_vm {
    local vm="&category=vm&action=list"
    local vm_url="$BASE_URL$vm"
    curl -X GET $vm_url | jq
}

function info_vm {
    local vm="&category=vm&action=info"
    local params="&vm_id=$1"
    local vm_url="$BASE_URL$vm$params"
    curl -X GET $vm_url | jq
}

function info_billing {
    local billing="&category=billing&action=credit"
    local billing_url="$BASE_URL$billing"
    curl -X GET $billing_url | jq
}

function delete_volume {
    local volume_id=$1
    local region="montreal"
    local category="&category=volume"
    local action="&action=delete"
    local params="&region=$region&volume_id=$volume_id"
    local url="$BASE_URL$category$action$params"

    echo $url
    curl -X POST $url

}

function delete_vm {
    local vm_id=$1
    local region="montreal"
    local category="&category=vm"
    local action="&action=delete"
    local params="&region=$region&vm_id=$vm_id"
    local url="$BASE_URL$category$action$params"

    echo $url
    curl -X POST $url

}

function 

function debug {
    echo "debugging..."
}



# # RUN THIS ONCE
# VOLUME_ID=$(create_volume)
# VM_ID=$(create_vm $VOLUME_ID)
# printf "VOLUME_ID: $VOLUME_ID\nVM_ID: $VM_ID\n"

# # VOLUME_ID=$(list_volume | jq -r "")
# VM_ID=$(list_vm | jq -r ".vms[0].vm_id")
# IP=$(info_vm $VM_ID | jq -r ".info.addresses[0].addr")
# echo $IP

# list_vm

# # add_dns_zone
# ZONE_ID=$(list_dns | jq -r ".zones" | jq 'keys[]' | bc)

# echo $ZONE_ID

# add_dns_record $ZONE_ID $IP

# list_dns
# # CAREFUL
# # RE-ENTER ID's based on previous debug output
# VOLUME_ID=10792
# VM_ID=a8337b1d-9cae-4835-8f29-54687c64f6b5
# delete_vm $VM_ID
# sleep 9
# delete_volume $VOLUME_ID