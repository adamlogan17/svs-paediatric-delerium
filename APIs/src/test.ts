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
function createPool(database:string, user="postgres", password="postgrespw") : Pool {
  return new Pool({
    host: "postgres",
    user: user,
    database: database, 
    password: password, 
    port: 5432
  });
}

/**
 * Creates a simply SQL select query, only creates a query with valid syntax but does not check if the content of the query is correct
 * @author Adam Logan
 * @param table The table the data is to be selected from
 * @param condition A condition to filter the data upon
 * @param data The columns to be selected
 * @returns A query that will return the required results
 */
function createSelect(table:string, condition?:string, data?:string[]) : string {
  let query:string = "SELECT ";

  query += data == undefined ? "*" : query += data.concat();

  query += " FROM " + table;

  query += condition != undefined ? " WHERE " + condition: "";

  return query;
}

/**
 * Creates a simple SQL insert query, only creates a query with valid syntax but does not check if the content of the query is correct
 * @param table The table where the data is required to be inserted
 * @param columns The column names that are being inserted
 * @param data The data to be inserted, must match the length of the 'columns' parameter
 * @param upsertCol If a row exists with the same data, the existing row will be updated with the new data
 * @returns A query that inserts data into a table
 */
function createInsert(table:string, columns:string[], data:string[], upsertCol?:string) : string {
  let failedMssg:string = "FAILED";
  let query:string = "";

  query = "INSERT INTO (" + data.concat() + ") VALUES (" + columns.concat()+ ")";

  query = columns.length !== data.length ? failedMssg : query;

  // UPSERT operation, not yet implemented
  if (upsertCol !== undefined) {
    query = !columns.includes(upsertCol) ? failedMssg : query;
  }

  return query
}

/**
 * Gets all the data from a specific table
 * @author Adam Logan
 * @param request Requires the parameter 'table'
 * @param response Returns an object with the property 'allData' which contains an array of the returned rows as an object
 */
export function getAll(request: Request, response: Response) {
  const table:string = request.params.table;

  const pool = createPool("test_database");

  pool.query(createSelect(table), (error, results) => {
    if (error) {
      throw error
    }
    response.send({
      allData: results.rows
    })
  })
}