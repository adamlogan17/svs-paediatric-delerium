import express, { Request, Response } from "express";
import { Pool } from "pg";

/**
 * Creates a pool object to connect to a database
 * @author Adam Logan
 * @param database The name of the database to connect to
 * @param user The username of the user to be used
 * @param password The password associated with the username
 * @returns A pool object that allows queries to be ran on a database
 */
function createPool(database:string, user="postgres", password="postgrespw"): Pool {
  return new Pool({
    host: "postgres",
    user: user,
    database: database, 
    password: password, 
    port: 5432
  });
}

export function getAll(request: Request, response: Response) {
  const table:string = request.params.table;
  let selectQuery:string = "SELECT * FROM " + table;

  const pool = createPool("test_database");
  pool.query(selectQuery, (error, results) => {
    if (error) {
      throw error
    }
    response.send({
      allData: results.rows
    })
  })
}