ARGS=$(getopt -a --options bcn --long "background,clean,nuclear" -- "$@")

eval set -- "$ARGS"

background="false"
clean="false"
nuclear="false"
production="false"


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
    -n|--production)
        production="true"
        shift;;
    --)
        break;;
        *)
        printf "Unknown option %s\n" "$1"
        exit 1;;
    esac
done

docker-compose down

if [ "$c" ] || [ "$n" ]; then
    # removes all containers
    docker rm -a -f -v $(docker ps -q -f name="svs")
fi

if [ -z "$p" ]; then
    # removes the postgres server volume
    docker volume rm svs-paediatric-delerium_svs-data
fi

# Check if n flag is set
if [ "$n" ]; then
    # removes all images related to the project
    docker rmi $(docker images -a -f ancestor=postgres -q)
    docker rmi $(docker images -a -f ancestor=svs-paediatric-delerium-audit -q)
    docker rmi $(docker images -a -f ancestor=svs-paediatric-delerium-apis -q)
fi

# Check if b flag is set
if [ "$b" ]; then
    # starts all containers in the background
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
elif [ "$p" ]; then
    docker rm -a -v -f $(docker ps -q -f name="prod_svs")

    docker rmi $(docker images -a -f ancestor=svs-paediatric-delerium-audit -q)
    docker rmi $(docker images -a -f ancestor=svs-paediatric-delerium-apis -q)

    docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
else
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
fi