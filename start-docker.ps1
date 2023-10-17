param(
    [Parameter(HelpMessage="Executes 'docker-compose' in the background")]
    [switch]$b = $False,
    
    [Parameter(HelpMessage="Deletes all containers and volumes within docker (not just those related to this project)")]
    [switch]$c = $False,

    [Parameter(HelpMessage="Deletes all project images (will delete an image named 'postgres' even if it is not related to the project)")]
    [switch]$n = $False
)

docker-compose down

# TODO delete all the containers just for the project, and the same with the volumes, will need to name the volumes
if($c -or $n) {
    # removes all containers
    docker rm -f $(docker ps -a -q)

    # removes all volumes
    docker volume rm $(docker volume ls -q)
} else {
    # removes the postgres server volume
    docker volume rm svs-paediatric-delerium_data
}

if($n) {
    # removes all images related to the project
    docker rmi $(docker images -a postgres -q)
    docker rmi $(docker images -a svs-paediatric-delerium-audit -q)
    docker rmi $(docker images -a svs-paediatric-delerium-apis -q)
}

if($b) {
    # starts all containers in the background
    docker-compose up -d
} else {
    docker-compose up
}