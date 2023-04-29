- [svs-paediatric-delerium](#svs-paediatric-delerium)
  - [Summary](#summary)
  - [How to start the project](#how-to-start-the-project)
    - [Using the Script](#using-the-script)
      - [**Windows**](#windows)
        - [*Powershell set up*](#powershell-set-up)
      - [**Linux**](#linux)
    - [Using Docker](#using-docker)
    - [Running Without Docker](#running-without-docker)
  - [Initialising DB](#initialising-db)
  - [Access Database Server](#access-database-server)
    - [CLI](#cli)
    - [pgAdmin4](#pgadmin4)
      - [**Access**](#access)
      - [**View Tables**](#view-tables)

# svs-paediatric-delerium

## Summary

This is the final year project for the SvS team. Currently the project consists of a prototype Audit system which will display compliance data for delerium treatment within PICUs across the UK & ROI.

## How to start the project

### Using the Script

The will delete the existing database volume for this project before starting the project to allow the database to be re-initialised.

The following arguments can be supplied to each script

- ```-b```
  - Executes in the background
- ```-c```
  - Deletes all containers and volumes within docker (not just those related to this project)
- ```-n```
  - Deletes all project images (will delete an image named 'postgres' even if it is not related to the project)


#### **Windows**

```powershell
./start-docker.ps1
```

##### *Powershell set up*

If you wish to use the ```powershell``` script you may need to run the following command with administrator access, within the powershell application.

```powershell
Set-ExecutionPolicy RemoteSigned
```

#### **Linux**

```bash
./start-docker.sh
```

### Using Docker

```console
docker-compose up
```

### Running Without Docker

Please view the respective READMEs to see how to run the projects without Docker.

## Initialising DB

If the ```database-set-up.sh``` file is causing errors, when starting the docker container, stop the container and run the commands below, within a bash terminal. Once this is done, then attempt to run the container again. See the stackoverflow answer [here](https://stackoverflow.com/questions/27176781/bash-file-returns-unexpected-token-do-r).

```bash
vi database-set-up.sh
:set ff=unix
:wq
```

If you would like to change the setup of the database alter the ```.sql``` files within the relevant database folder within the ```sql``` folder.

## Access Database Server

### CLI

To access the database once the container is running use the below command where ```containerID``` is replaced with the ID of the database container.

```console
docker exec -it containerID psql -U postgres
```

### pgAdmin4

The instructions [here](https://towardsdatascience.com/how-to-run-postgresql-and-pgadmin-using-docker-3a6a8ae918b5) were followed to set up pgAdmin4.

#### **Access**

The instructions below must be repeated every time the project is launched.

1. Go to <http://localhost:5050/>, the page may take a while to load
2. Enter in the following details

    - username = admin@admin.com
    - password = root

3. Select 'Add New Server'
4. Enter any name you would like for the server to be called
5. Select the 'Configuration' tab and enter the below details, the default values for the other fields mentioned below should be left

    - Host name/address = svs_postgres
    - Username = postgres
    - Password = postgrespw

#### **View Tables**

- Within the side panel go to serverName -> Databases -> databaseName -> Schemas -> public -> Tables
  - Replace 'severName' with the name given to the server in step 4 within the [Access](#access) section
  - Replace 'databaseName' with the specific name of the database in which the tables are contained in
- To view the data within the table right click the table name and select 'View/Edit Data'
