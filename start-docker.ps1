param(
    [Parameter(HelpMessage="Executes 'docker-compose' in the background")]
    [switch]$b = $False,
    
    [Parameter(HelpMessage="Deletes all containers and volumes within docker (not just those related to this project)")]
    [switch]$c = $False,

    [Parameter(HelpMessage="Deletes all project images (will delete an image named 'postgres' even if it is not related to the project)")]
    [switch]$n = $False,

    [Parameter(HelpMessage="Runs the project in production mode")]
    [switch]$p = $False
)

docker-compose down

# Ensures the 'database-set-up.sh' file is in the correct format
$filePath = "database-set-up.sh"
$content = Get-Content -Raw -Path $filePath
# Replace Windows line endings (CRLF) with Unix line endings (LF)
$content = $content -replace "`r`n", "`n"
Set-Content -Value $content -Path $filePath -NoNewline -Encoding utf8

if($c -or $n) {
    Write-Host "Removing all containers with 'svs' within the name..." -ForegroundColor Cyan -BackgroundColor Black
    Write-Host ""

    # removes all containers with 'svs' in the name
    docker rm -v -f $(docker ps -q -a -f name="svs")

    Write-Host ""
    Write-Host "Remove complete!" -ForegroundColor Cyan -BackgroundColor Black
    Write-Host ""
} 

if(!$p) {
    # removes the postgres server volume
    Write-Host "Removing the volume which contains the data for the DB..." -ForegroundColor Cyan -BackgroundColor Black
    Write-Host ""
    docker volume rm svs-paediatric-delerium_svs-data
    Write-Host "Removed the volume which contains the data for the DB..." -ForegroundColor Cyan -BackgroundColor Black
    Write-Host ""
}

if($n) {
    # removes all images related to the project
    Write-Host "Removing the svs images, postgres image and pgamdin4 image..." -ForegroundColor Cyan -BackgroundColor Black
    Write-Host ""

    docker rmi $(docker images -a postgres -q)
    docker rmi $(docker images -a dpage/pgadmin4 -q)
    docker rmi $(docker images -a svs-paediatric-delerium-audit -q)
    docker rmi $(docker images -a svs-paediatric-delerium-apis -q)

    Write-Host ""
    Write-Host "Remove complete!" -ForegroundColor Cyan -BackgroundColor Black
    Write-Host ""
}

if($b) {
    # starts all containers in the background
    Write-Host "Starting DEV containers in background..." -ForegroundColor Cyan -BackgroundColor Black
    Write-Host ""

    docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
} elseif ($p) {
    Write-Host "Removing PROD containers..." -ForegroundColor Cyan -BackgroundColor Black
    Write-Host ""
    
    docker rm -a -v -f $(docker ps -q -f name="prod_svs")

    Write-Host ""
    Write-Host "Remove complete!..." -ForegroundColor Cyan -BackgroundColor Black
    Write-Host ""

    Write-Host "Removing svs images..." -ForegroundColor Cyan -BackgroundColor Black
    Write-Host ""

    docker rmi $(docker images -a svs-paediatric-delerium-audit -q)
    docker rmi $(docker images -a svs-paediatric-delerium-apis -q)

    Write-Host ""
    Write-Host "Remove complete!..." -ForegroundColor Cyan -BackgroundColor Black
    Write-Host ""

    Write-Host "Starting PROD containers in..." -ForegroundColor Cyan -BackgroundColor Black
    Write-Host ""
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
} else {
    Write-Host "Starting DEV containers in..." -ForegroundColor Cyan -BackgroundColor Black
    Write-Host ""
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
}