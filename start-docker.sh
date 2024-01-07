#!/bin/bash

dump_database() {
    # Get the current day of the month
    day=$(date +%d)

    # Check if the day is a multiple of 28
    if (( day % 28 == 0 )); then
        docker exec -t dev_svs_postgres pg_dumpall -c -U postgres > dump_grandfather.sql
        Echo "Dumping grandfather database..."
    # Check if the day is a multiple of 7 but not 28
    elif (( day % 7 == 0 )); then
        docker exec -t dev_svs_postgres pg_dumpall -c -U postgres > dump_father.sql
        echo "Dumping father database..."
    else
        docker exec -t dev_svs_postgres pg_dumpall -c -U postgres > dump_child.sql
        echo "Dumping child database..."
    fi
}

restore_database() {
    # Check the argument passed to -r
    case "$1" in
        c) #child dump
            echo "Restoring child database..."
            /bin/bash -c "cat dump_child.sql | docker exec -i dev_svs_postgres psql -U postgres"
            ;;
        f) #father dump
            echo "Restoring father database..."
            /bin/bash -c "cat dump_father.sql | docker exec -i dev_svs_postgres psql -U postgres"
            ;;
        g) #grandfather dump
            echo "Restoring grandfather database..."
            /bin/bash -c "cat dump_grandfather.sql | docker exec -i dev_svs_postgres psql -U postgres"
            ;;
        *)
            echo "Invalid argument to -r: $1"
            exit 1
            ;;
    esac
}

create_cron_job() {
    # Write out current crontab
    crontab -l > mycron
    # Echo new cron into cron file
    echo "0 0 * * * start-docker.sh -d" >> mycron
    # Install new cron file
    crontab mycron
    rm mycron
}

# Add this function to your script
stop_cron_job() {
    # Write out current crontab
    crontab -l > mycron
    # Remove the cron job
    sed -i '/start-docker.sh -d/d' mycron
    # Install new cron file
    crontab mycron
    rm mycron
}

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
        -d|--d)
            dump_database
            exit 0
            ;;
        -r|--r)
            shift
            restore_database $1
            exit 0
            ;;
        -startcron)
            create_cron_job
            exit 0
            ;;
        -stopcron)
            stop_cron_job
            exit 0
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
    docker rm -v -f $(docker ps -q -a -f name="prod_svs")
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