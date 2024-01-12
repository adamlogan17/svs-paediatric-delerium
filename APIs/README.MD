- [APIs](#apis)
  - [Summary](#summary)
  - [Technical Requirements](#technical-requirements)
  - [How to start the project](#how-to-start-the-project)
  - [Documentation](#documentation)
  - [How to run tests](#how-to-run-tests)
  - [File Structure Explanation](#file-structure-explanation)
  - [Typescript File](#typescript-file)
  - [Convert to HTTPS](#convert-to-https)
  - [Database set up](#database-set-up)

# APIs

## Summary

This is a collection of endpoints for the Audit and E-Learning applications. It is important to note that a few of these endpoints will not work correctly as they require the database to be running.

## Technical Requirements

- [Node.Js vv20.10.0](https://nodejs.org/en/download)
- [Postgres v16.1](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads)

## How to start the project

Run the below commands.

```console
npm install
npm run start:dev
```

## Documentation

The below command, creates documentation for the site, based on the JSDOC comments within the code. See [here](https://typedoc.org/guides/overview/) for information on TypeDoc.

```console
npm run docs
```

- The site can be viewed by opening `./docs/site/index.html` in a web browser
- Markdown files can be viewed within the folder `./docs/markdown`

## How to run tests

```console
npm run test
```

## File Structure Explanation

- Each file within the ```src``` folder represents a service within the application
- Each file within the ```test``` folder are tests for a specific service

## Typescript File

Before the first time you run the program you need to use the command ```npm install```

The below command is how Typescript files can be ran. Note that you require to be in the same directory as the file you wish to run.

```console
npx ts-node file.ts
```

## Convert to HTTPS

Within the `./src/index.ts`, at the bottom of the file.

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

## Database set up

If you would like to use all the current endpoints, that interact with a database, ensure that the SQL, within `../sql/audit`, `../sql/audit/create-user-roles.sql` and `../sql/audit/create-triggers.sql`, is executed within a database named `audit`.
