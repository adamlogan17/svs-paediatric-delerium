#!/bin/bash

# Parse command-line options
while [[ $# -gt 0 ]]; do
    case "$1" in
        -b|--b)
            b=true
            shift
            ;;
        -c|--c)
            c=true
            shift
            ;;
        -n|--n)
            n=true
            shift
            ;;
        -p|--p)
            p=true
            shift
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

docker-compose down

# Ensures the 'database-set-up.sh' file is in the correct format
# vi database-set-up.sh<<EOF
# :set ff=unix
# :wq
# EOF

# The below effictively does the same as the above, but without the need for vi
tr -d '\r' < database-set-up.sh > temp-file
mv temp-file database-set-up.sh
rm temp-file

if [ "$c" ] || [ "$n" ]; then
    # Remove the postgres server volume
    echo "Removing all containers with 'svs' in the name..."
    echo ""
    docker rm -v -f $(docker ps -q -a -f name="svs")
    echo ""
    echo "Remove complete!"
    echo ""
elif [ -z "$p" ]; then
    # Remove the postgres server volume
    docker volume rm svs-paediatric-delerium_svs-data
fi

# Check if n flag is set
if [ "$n" ]; then
    # removes all images associated with the project
    echo "Removing the svs images, postgres image, and pgadmin4 image..."
    echo ""
    docker rmi $(docker images -a postgres -q)
    docker rmi $(docker images -a dpage/pgadmin4 -q)
    docker rmi $(docker images -a svs-paediatric-delerium-audit -q)
    docker rmi $(docker images -a svs-paediatric-delerium-apis -q)
    echo ""
    echo "Remove complete!"
    echo ""
fi

# Check if b flag is set
if [ "$b" ]; then
    echo "Starting DEV containers in the background..."
    echo ""
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
elif [ "$p" ]; then
    echo "Removing PROD containers..."
    echo ""
    docker rm -a -v -f $(docker ps -q -f name="prod_svs")
    echo ""
    echo "Remove complete!"
    echo ""
    
    remove_project_images
    
    echo "Starting PROD containers..."
    echo ""
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
else
    echo "Starting DEV containers..."
    echo ""
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
fi