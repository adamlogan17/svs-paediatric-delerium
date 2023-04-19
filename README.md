- [svs-paediatric-delerium](#svs-paediatric-delerium)
  - [How to start the project](#how-to-start-the-project)
    - [Using the Script](#using-the-script)
    - [Using Docker](#using-docker)
    - [Running Without Docker](#running-without-docker)
      - [**Frontend**](#frontend)
      - [**Backend**](#backend)
    - [Typescript File](#typescript-file)
  - [Initialising DB](#initialising-db)
  - [Access Database Server](#access-database-server)
    - [CLI](#cli)
    - [pgAdmin4](#pgadmin4)
      - [**Access**](#access)
      - [**View Tables**](#view-tables)
  - [How to use server](#how-to-use-server)

# svs-paediatric-delerium

## How to start the project

### Using the Script

There are 2 scripts, one for ```powershell``` and another for ```bash```, which will delete the existing database volume for this project before starting the project to allow the database to be re-initialised.

If you wish to use the ```powershell``` script you may need to run the following command with administrator access

```powershell
Set-ExecutionPolicy RemoteSigned
```

To run the script use the command below with the appropriate file extension (```.ps1``` when using ```powershell``` and ```.sh``` when using ```bash```).

```powershell
./start-docker.ps1
```

### Using Docker

```console
docker-compose up
```

### Running Without Docker

#### **Frontend**

```console
cd example-frontend
npm run start
```

Before the first time you run the program you need to use the command ```npm install```

#### **Backend**

```console
cd APIs\example-api
npm run start:dev
```

### Typescript File

```console
npx ts-node src/file.ts
```

Before the first time you run the program you need to use the command ```npm install```

## Initialising DB

If the ```database-set-up.sh``` file is causing errors, when starting the docker container, stop the container and run the commands below. Once this is done, then attempt to run the container again. See the stackoverflow answer [here](https://stackoverflow.com/questions/27176781/bash-file-returns-unexpected-token-do-r).

```bash
vi database-set-up.sh
:set ff=unix
:wq
```

If you would like to change the setup of the database alter the ```.sql``` files within the relevant database folder within the ```sql``` folder.

## Access Database Server

### CLI

To access the database once the container is running use the command ```docker exec -it containerID psql -U postgres``` where ```containerID``` is replaced with the ID of the database container.

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

## How to use server

"See the message from IT admin. EEECS students can login to my server (143.117.69.4) machine in ECIT using their existing EEECS accounts. When they login the format at the login screen is studentnumber@eeecs.qub.ac.uk - they use the password they use when they login to the machines in the CSB or the Ashby.  We can't give access to the ECIT VPN to undergrad students. So students will need to access this machine from the campus."
