- [APIs](#apis)
  - [Summary](#summary)
  - [How to start the project](#how-to-start-the-project)
  - [How to run tests](#how-to-run-tests)
  - [File Structure Explanation](#file-structure-explanation)
  - [Typescript File](#typescript-file)

# APIs

## Summary

This is a collection of endpoints for the Audit and E-Learning applications. It is important to note that a few of these endpoints will not work correctly as they require the database to be running.

## How to start the project

Run the below commands.

```console
npm install
npm run start:dev
```

## How to run tests

```console
npm run test
```

## File Structure Explanation

- Each file within the ```src``` folder represents a service within the application
- Each file within the ```test``` folder are tests for a specific service

## Typescript File

The below command is how Typescript files can be ran. Note that you require to be in the same directory as the file you wish to run.

```console
npx ts-node file.ts
```

Before the first time you run the program you need to use the command ```npm install```
