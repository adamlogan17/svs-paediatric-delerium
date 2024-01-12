- [svs-paediatric-delerium](#svs-paediatric-delerium)
  - [Summary](#summary)
  - [Technical Requirements](#technical-requirements)
  - [How to start the project](#how-to-start-the-project)
    - [Windows](#windows)
      - [Powershell set up](#powershell-set-up)
    - [Linux](#linux)
    - [Script Arguments](#script-arguments)
      - [Backup (only on linux)](#backup-only-on-linux)
      - [Restore (only on linux)](#restore-only-on-linux)
    - [Using Docker](#using-docker)
      - [Development Mode](#development-mode)
      - [Production Mode](#production-mode)
    - [Running Without Docker](#running-without-docker)
    - [Initialising Database](#initialising-database)
  - [File Structure](#file-structure)
  - [Accessing Database Server](#accessing-database-server)
    - [CLI](#cli)
    - [PgAdmin4](#pgadmin4)
      - [Access](#access)
      - [View Tables](#view-tables)
  - [Convert Backend to use HTTPS](#convert-backend-to-use-https)
    - [Removing Caesar Cipher](#removing-caesar-cipher)

# svs-paediatric-delerium

## Summary

This is the final year project for the SvS team. Currently the project consists of a prototype Audit system which will display compliance data for delerium treatment within PICUs across the UK & ROI.

The problem that required this system is that paediatric ICUs had no modern and convenient way to record data regarding patients experiencing delirium. The approach taken was one of modernisation and simplification to assist the ICUs. This was done using software engineering techniques to aid in development and create a system that improved on the previous one. This work will greatly aid the nurses in paediatric ICUs in their process of recording the Audit data.

## Technical Requirements

Only Docker is specifically required to run the project, but Postgres and Node.Js is required if the application is to be ran without the use of Docker.

- [Docker v4.25.2](https://docs.docker.com/get-docker/)
- [docker-compose v2.20.3](https://docs.docker.com/compose/install/)
- [Node.Js vv20.10.0](https://nodejs.org/en/download), required to generate the documentation

## How to start the project

A start-up script is used to start the application. There is both a `.ps1` version, for window machines, and a `.sh`, for linux machines.

To allow powershell scripts to run on you machine, please follow the instructions within the [PowerShell set up](#powershell-set-up) section.

Please see the commands below to start the application

### Windows

```powershell
./start-docker.ps1
```

#### Powershell set up

If you wish to use the ```powershell``` script you may need to run the following command with administrator access, within the powershell application.

```powershell
Set-ExecutionPolicy RemoteSigned
```

### Linux

```bash
./start-docker.sh
```

### Script Arguments

The will delete the existing database volume for this project before starting the project to allow the database to be re-initialised.

The following arguments can be supplied to each script

- ```-b```
  - Executes in the background
- ```-c```
  - Deletes all containers and volumes related to the document
- ```-n```
  - Deletes all project images along with containers and volumes
- ```-p```
  - Starts the production environment, if in a Linux environment and the `.sh` script is used this also sets cronjobs for the backup along with the rolling delete of the log data.

#### Backup (only on linux)

- ```-d```
  - Creates a dump of the database
- ```-startcron```
  - Begins a crontab daemon that will dump the database at midnight everyday
- ```-stopcron```
  - Stops the crontab daemon

#### Restore (only on linux)

- ```-r c```
  - Restores the child dump.
- ```-r f```
  - Restores the father dump.
- ```-r g```
  - Restores the grandfather dump.

### Using Docker

The docker daemon must be running.

#### Development Mode

```console
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

#### Production Mode

```console
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
```

### Running Without Docker

The backend needs to have a postgres sever with the.

More about the frontend and the backend can be found in their respective `README.md`'s.

### Initialising Database

If the ```database-set-up.sh``` file is causing errors, when starting the docker container, stop the container and run the commands below, within a bash terminal. Once this is done, then attempt to run the container again. See the stackoverflow answer [here](https://stackoverflow.com/questions/27176781/bash-file-returns-unexpected-token-do-r).

```bash
vi database-set-up.sh
:set ff=unix
:wq
```

If you would like to change the setup of the database alter the ```.sql``` files within the relevant database folder within the ```sql``` folder.

## File Structure

- Docker: These files are stored within the main directory of the project, which includes:
  - The `docker-compose` files for both the development and production environments
  - The required `database-set-up.sh` script which is used to build the database
    - This script requires the existance of the `./sql` folder, and it's subfolders
- PgAmin4: The relevant files to set up the Postgres server with PgAdmin4 are within the `./pgadmin4` folder and more can be learnt [here](#pgadmin4)
- Startup Scripts: Both these scripts reside in the main directory
- Backend: Stored within the `./APIs` folder
  - A specific README for the backend can be found at `./APIs/README.MD`
  - The main code of the project can be found in `./APIs/src`
  - The automated tests can be found in `./APIs/tests`
  - When the commands `npm install` & `npm run docs` is executed within the `./APIs` directory:
    - The site can be viewed by opening `./APIs/docs/site/index.html` in a web browser
    - Markdown files can be viewed within the folder `./APIs/docs/markdown`
- Frontend: Stored within the `./Audit` folder
  - A specific README for the backend can be found at `./Audit/README.MD`
  - When the command `npm install` & `npm run docs` is executed within the `./Audit` directory:
    - The site can be viewed by opening `./Audit/docs/site/index.html` in a web browser
    - Markdown files can be viewed within the folder `./Audit/docs/markdown`
  - Custom components made for the application can be found at `./Audit/src/components`
  - The pages of the site can be found in `./Audit/src/pages`
  - The entry point of the applications is the `./Audit/src/index.tsx` files
  - The routing can be found in `./Audit/src/AppRouter.tsx`
  - Images, used for the site can be found in `./Audit/src/assets/images`
- Database:
  - The `.sql` files that build the database belong in the `sql` file
    - Each subfolder represents a separate database and these folders contain the `.sql` files

## Accessing Database Server

### CLI

To access the database once the container is running use the below command where ```{dev|prod}``` depends if the development or production environment is running.

```console
docker exec -it {dev|prod}_svs_postgres psql -U postgres
```

### PgAdmin4

The instructions [here](https://towardsdatascience.com/how-to-run-postgresql-and-pgadmin-using-docker-3a6a8ae918b5) were followed to set up pgAdmin4. This is only available within the development environment.

#### Access

The instructions below must be repeated every time the project is launched.

1. Go to <http://localhost:5050/>, the page may take a while to load
2. Enter in the following details

    - username = <admin@admin.com>
    - password = root

3. Select the server named ```dev-svs-postgres-server``` and enter the password ```postgrespw```

Alternatively to step 3, you can add the server manually following the steps below:

1. Select 'Add New Server'
2. Enter any name you would like for the server to be called
3. Select the 'Connection' tab and enter the below details, the default values for the other fields mentioned below should be left

    - Host name/address = svs_postgres
    - Username = postgres
    - Password = postgrespw

#### View Tables

- Within the side panel go to serverName -> Databases -> databaseName -> Schemas -> public -> Tables
  - Replace 'severName' with the name given to the server in step 4 within the [Access](#access) section
  - Replace 'databaseName' with the specific name of the database in which the tables are contained in
- To view the data within the table right click the table name and select 'View/Edit Data'

## Convert Backend to use HTTPS

Within the `./APIs/src/index.ts`, at the bottom of the file.

Ensure the below code is uncommented:

```typescript
https.createServer(options, app)
.listen(port, () => {
  console.log(`listen port ${port}`);
  console.log(`Go to https://${baseIP}:${port}/swagger-docs for documentation`);
});
```

Ensure the below code is commented out:

```typescript
app.listen(port,()=> {
  console.log(`listen port ${port}`);
  console.log(`Go to http://${baseIP}:${port}/swagger-docs for documentation`);
});
```

Ensure your own `./APIs/server.cert` and `./APIs/server.key` is used.

### Removing Caesar Cipher

As traffic is encrypted, there is no practical need for the Caesar cipher used, although the application will still work with this.

If you would like to remove this it can be done by replacing the `./login` endpoint definition with the below:

```typescript
app.post("/login", (request: Request, response: Response, next:NextFunction) => authenticate);
```

Then the configuration, when calling the `./login` endpoint within `./Audit/src/pages/SignIn/SignIn.tsx` can be changed to the below:

```typescript
const loginConfig = {
  method: "post",
  url: `${process.env.REACT_APP_API_URL}/login`, 
  data: {
    username: username,
    password: password,
  }
};
```

The `ceaserCipherr` method can then be removed from this file, if so wished.
