ARGS=$(getopt -a --options bcn --long "background,clean,nuclear" -- "$@")

eval set -- "$ARGS"

background="false"
clean="false"
nuclear="false"

while true; do
    case "$1" in
    -b|--background)
        background="true"
        shift;;
    -c|--clean)
        clean="true"
        shift;;
    -n|--nuclear)
        nuclear="true"
        shift;;
    --)
        break;;
        *)
        printf "Unknown option %s\n" "$1"
        exit 1;;
    esac
done

docker-compose down

if [ $clean == true ] || [ $nuclear == true ]; then
    # removes all containers
    docker rm -f $(docker ps -a -q)

    # removes all volumes
    docker volume rm $(docker volume ls -q)
else 
    # removes the postgres server volume
    docker volume rm svs-paediatric-delerium_data
fi

if [ $nuclear == true ]; then
    # removes all images related to the project
    docker rmi $(docker images -a postgres -q)
    docker rmi $(docker images -a svs-paediatric-delerium-frontend -q)
    docker rmi $(docker images -a svs-paediatric-delerium-apis -q)
fi

if [ $background == true ]; then
    # starts all containers in the background
    docker-compose up -d
else 
    docker-compose up
fi