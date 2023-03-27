import { Request, Response } from "express";
import { Pool } from "pg";

/**
 * Creates a pool object to connect to a database
 * @author Adam Logan
 * @date 2023-03-26
 * @param { string } database The name of the database to connect to
 * @param { string } [user="postgres"] The username of the user to be used
 * @param { string } [password="postgrespw"] The password associated with the username
 * @returns { Pool } A pool object that allows queries to be ran on a database
 */
function createPool(database:string, user:string="postgres", password:string="postgrespw") : Pool {
  console.log("password");
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
 * @date 2023-03-23
 * @param { string } table The table the data is to be selected from
 * @param { string } [condition] A condition to filter the data upon
 * @param { string[] } [data] The columns to be selected
 * @returns { string } A query that will return the required results
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
 * @author Adam Logan
 * @date 2023-03-23
 * @param { string } table The table where the data is required to be inserted
 * @param { string[] } columns The column names that are being inserted
 * @param { string[] } data The data to be inserted, must match the length of the 'columns' parameter
 * @param { string } [upsertCol] If a row exists with the same data, the existing row will be updated with the new data
 * @returns { string } A query that inserts data into a table
 * TODO Need to implement the UPSERT functionality
 */
function createInsert(table:string, columns:string[], data:string[], upsertCol?:string) : string {
  const FAILEDMSSG:string = "FAILED";
  let query:string = "";

  data = data.map((element) => {
    return "'" + element + "'";
  });

  query = "INSERT INTO " + table + " (" + columns.concat() + ") VALUES (" + data.concat() + ")";

  query = columns.length !== data.length ? FAILEDMSSG : query;

  // UPSERT operation, not yet implemented
  if (upsertCol !== undefined) {
    query = !columns.includes(upsertCol) ? FAILEDMSSG : query;
  }

  return query
}

/**
 * Creates a simple update SQL statement
 * @author Adam Logan
 * @date 2023-03-26
 * @param { string } table The table to update the data in
 * @param { string[] } columns The columns that are being changed
 * @param { string[] } data The data to change to, must be the same length as the columns array
 * @param { string } predicate The condition to decide which rows to update
 * @returns { string } The update SQL statement
 */
function createUpdate(table:string, columns:string[], data:string[], predicate:string) : string {
  const FAILEDMSSG:string = "FAILED";
  let query:string = ""

  let updateVals:string[] = columns.map((element:string, index:number) => {
    return element + " = '" + data[index] + "'";
  });

  query = "UPDATE " + table + " SET " + updateVals.concat() + " WHERE " + predicate + ";";
  query = columns.length !== data.length ? FAILEDMSSG : query;

  return query;
}

/**
 * Creates a simple delete SQL statement
 * @author Adam Logan
 * @date 2023-03-27
 * @param { string } table The table to delete the data from
* @param { string } [predicate] The condition to delete the data for
 * @returns { string } The delete SQL statement
 */
function createDelete(table: string, predicate?:string) : string {
  let query:string = "DELETE FROM " + table;

  query = predicate !== undefined ? query + " WHERE " + predicate : query;

  return query;
}

/**
 * Gets all the data from a specific table
 * @author Adam Logan
 * @date 2023-03-23
 * @param { Request } request Requires the parameter 'table'
 * @param { Response } response Returns an object with the property 'allData' which contains an array of the returned rows as an object
 * @returns { void }
 */
export function getAll(request: Request, response: Response): void {
  const table:string = request.params.table;

  const POOL = createPool(request.params.database, "test_user", "password");

  POOL.query(createSelect(table), (error, results) => {
    if (error) {
      throw error;
    }
    response.send({
      allData: results.rows
    });
  });
}

/**
 * Inserts data into the database
 * @author Adam Logan
 * @date 2023-03-24
 * @param { Request } request Requires the body to be in the format {"table":"table_name", "columns":["col1","col2"], "data":["data1","data2"]}
 * @param { Response } response Returns a message if the data has been successfully inserted
 * @returns { void }
 */
export function insertData(request: Request, response: Response): void {
  const { table, columns, data } = request.body;
  
  const POOL = createPool(request.params.database, "test_user", "password");

  POOL.query(createInsert(table, columns, data), (error, results) => {
    if (error) {
      throw error;
    }
    response.send("Successfully Inserted the Data 😊");
  });
}

/**
 * Updates a specific piece of data
 * @author Adam Logan
 * @date 2023-03-26
 * @param { Request } request Requires the body to be in the format {"table":"table_name", "columns":["col1","col2"], "data":["data1","data2"], "predicate":"condition"}
 * @param { Response } response Returns a message if the data has been successfully updated
 * @returns { void }
 */
export function updateData(request: Request, response: Response): void {
  const { table, columns, data, predicate } = request.body;
  
  const POOL = createPool(request.params.database, "test_user", "password");

  POOL.query(createUpdate(table, columns, data, predicate), (error, results) => {
    if (error) {
      throw error;
    }
    response.send("Successfully Updated the Data 😊");
  });
}

/**
 * Deletes a specific piece of data
 * @author Adam Logan
 * @date 2023-03-27
 * @param { Request } request Requires the parameter 'table' and 'predicate' which is the condition that will delete data if it is true
 * @param { Response } response Returns a message if the data has been successfully deleted
 * @returns { void }
 */
export function deleteData(request: Request, response: Response): void {
  const TABLE:string = request.params.table;
  const PREDICATE:string = request.params.predicate;
  
  const POOL = createPool(request.params.database, "postgres", "postgrespw");

  console.log(createDelete(TABLE, PREDICATE));

  POOL.query(createDelete(TABLE, PREDICATE), (error, results) => {
    if (error) {
      throw error;
    }
    response.send("Successfully Deleted the Data 😊");
  });
}