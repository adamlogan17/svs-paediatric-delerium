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
export function createPool(database:string, user:string="postgres", password:string="postgrespw") : Pool {
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
 * @param { string[] } [data] The columns to be selected, including the function which you would like to perform
 * @param { string } [groupBy] The name of the column which you would like to group by
 * @returns { string } A query that will return the required results
 */
export function createSelect(table:string, condition?:string, data?:string[], groupBy?:string) : string {
  let query:string = "SELECT ";

  query += data == undefined ? "*" : data.concat();

  query += " FROM " + table;

  query += condition !== undefined ? " WHERE " + condition: "";

  query += groupBy !== undefined ? " GROUP BY " + groupBy : "";

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
export function createInsert(table:string, columns:string[], data:string[], upsertCol?:string) : string {
  const FAILEDMSSG:string = "FAILED";
  let query:string = "";

  data = data.map((element) => {
    return "'" + element + "'";
  });

  query = `INSERT INTO ${table} (${columns.concat()}) VALUES (${data.concat()}) RETURNING picu_id`;

  query = columns.length !== data.length ? FAILEDMSSG : query;

  // UPSERT operation, not yet implemented
  if (upsertCol !== undefined) {
    // query = !columns.includes(upsertCol) ? FAILEDMSSG : query;
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
export function createUpdate(table:string, columns:string[], data:string[], predicate:string) : string {
  const FAILEDMSSG:string = "FAILED";
  let query:string = ""

  let updateVals:string[] = columns.map((element:string, index:number) => {
    return element + " = '" + data[index] + "'";
  });

  query = `UPDATE ${table} SET ${updateVals.concat()} WHERE ${predicate} ;`;
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
export function createDelete(table: string, predicate?:string) : string {
  let query:string = `DELETE FROM ${table}`;

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

  let userForDb:string = request.params.role === undefined ? "postgres" : `${request.params.role}_role`;

  let passForDb:string = request.params.role === undefined ? "postgrespw": "password";

  const POOL = createPool(request.params.database, userForDb, passForDb);

  POOL.query(createSelect(table), (error:any, results:any) => {
    if(error == undefined) {
      response.send({
        allData: results.rows
      });
    }
    else if (error.code == 42501) {
      response.send("Invalid user");
    } else {
      response.send(error);
    }
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

  console.log(table);
  console.log(columns);
  console.log(data);

  let userForDb:string = request.params.role === undefined ? "postgres" : `${request.params.role}_role`;

  let passForDb:string = request.params.role === undefined ? "postgrespw": "password";

  const POOL = createPool(request.params.database, userForDb, passForDb);
  
  POOL.query(createInsert(table, columns, data), (error:any, results:any) => {
    if(error == undefined) {
      response.send("Successfully Inserted the Data 😊");
    }
    else if (error.code == 42501) {
      response.send("Invalid user");
    } else {
      response.send(error);
    }
    if (error) {
      throw error;
    }
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
  
  let userForDb:string = request.params.role === undefined ? "postgres" : `${request.params.role}_role`;

  let passForDb:string = request.params.role === undefined ? "postgrespw": "password";

  const POOL = createPool(request.params.database, userForDb, passForDb);

  POOL.query(createUpdate(table, columns, data, predicate), (error:any, results:any) => {
    if(error == undefined) {
      response.send("Successfully Updated the Data 😊");
    }
    else if (error.code == 42501) {
      response.send("Invalid user");
    } else {
      response.send(error);
    }
    
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
  
  let userForDb:string = request.params.role === undefined ? "postgres" : `${request.params.role}_role`;

  let passForDb:string = request.params.role === undefined ? "postgrespw": "password";

  const POOL = createPool(request.params.database, userForDb, passForDb);

  POOL.query(createDelete(TABLE, PREDICATE), (error:any, results:any) => {
    if(error == undefined) {
      response.send("Successfully Deleted the Data 😊");
    }
    else if (error.code == 42501) {
      response.send("Invalid user");
    } else {
      response.send(error);
    }
  });
}