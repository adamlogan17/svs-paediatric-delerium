import { Pool } from "pg";
import errorCodeMessage from "./errorCodeMessage";
import { types } from 'util';

const dbPassword:string = process.env.DEFAULTDBUSERPASS || "postgrespw";
const dbHost:string = process.env.DBHOST || "postgres";
const defaultUsername:string = process.env.DEFAULTDBUSERNAME || "postgres";
const dbPort:number = Number(process.env.DBPORT) || -1;

/**
 * Creates a pool object to connect to a database
 * @author Adam Logan
 * @date 2023-03-26
 * @param { string } database The name of the database to connect to
 * @param { string } [user="postgres"] The username of the user to be used
 * @param { string } [password="postgrespw"] The password associated with the username
 * @returns { Pool } A pool object that allows queries to be ran on a database
 */
export function createPool(database:string, user:string=defaultUsername, password:string=dbPassword) : Pool {
  return new Pool({
    host: dbHost,
    user: user,
    database: database, 
    password: password, 
    port: dbPort
  });
}

/**
 * Defines possible PostgreSQL comparisons for operations in predicates.
 * 
 * @author Adam Logan
 * 
 * @type PostgreSQLComparisons
 */
type PostgreSQLComparisons = '=' | '<' | '>' | '<=' | '>=' | '<>' | 'LIKE' | 'ILIKE' | 'BETWEEN' | 'IN' | 'IS NULL' | 'IS NOT NULL' | 'IS DISTINCT FROM' | 'IS NOT DISTINCT FROM' | 'NOT IN' | 'NOT LIKE' | 'NOT ILIKE' | 'NOT BETWEEN';

/**
 * Represents a predicate used for filtering data in SQL queries.
 * 
 * @author Adam Logan
 * 
 * @type Predicate
 * @property {string} column - The name of the column to apply the predicate on.
 * @property {string} value - The value to compare against in the predicate.
 * @property {PostgreSQLComparisons} operation - The comparison operation to perform.
 */
type Predicate = {
  column:string,
  value:string,
  operation:PostgreSQLComparisons
}

/**
 * Creates a simple SQL SELECT query. This function only ensures the syntax of the query is correct, 
 * it does not validate the content of the query.
 * 
 * @author Adam Logan
 * 
 * @param {string} table - The name of the table from which data is to be selected.
 * @param {Predicate[]} [conditions] - An array of conditions to filter the data. Each condition is an object with a column name, a value, and a comparison operator.
 * @param {string[]} [columns] - An array of column names to be selected. If this parameter is not provided, the function selects all columns (*).
 * @param {string} [groupBy] - The name of the column by which to group the results. This parameter is optional.
 * 
 * @returns {string} A SQL SELECT query that can be executed to get the required results.
 */
export function createSelect(table:string, conditions?:Predicate[], columns?:string[], groupBy?:string) : string {
  let query:string = "SELECT ";

  query += columns == undefined ? "*" : columns.concat();

  query += " FROM " + table;

  if (conditions !== undefined && conditions.length > 0) {
    const conditionStrs = conditions.map((condition, index) => `${condition.column} ${condition.operation} $${index + 1}`);
    query += " WHERE " + conditionStrs.join(" AND ");
  }

  query += groupBy !== undefined ? " GROUP BY " + groupBy : "";

  console.log(query);

  return query;
}

/**
 * Retrieves data from a specified table in the database based on the provided conditions.
 * @author Adam Logan
 *
 * @param {string} database - The name of the database.
 * @param {string} table - The name of the table to retrieve data from.
 * @param {string} userForDb - The username for accessing the database.
 * @param {string} passForDb - The password for accessing the database.
 * @param {Predicate[]} [condition] - An array of conditions to filter the data.
 * @param {string[]} [columns] - An array of column names to retrieve. If not provided, all columns will be retrieved.
 * @param {string} [groupBy] - The column by which to group the results.
 *
 * @returns {Promise<{ allData: any[] } | string>} - A promise that resolves to an object containing all the retrieved data or an error message.
 */
export async function retrieveData(database:string, table:string, userForDb:string, passForDb:string, condition?:Predicate[], columns?:string[], groupBy?:string): Promise<any[]|string> {
  const POOL = createPool(database, userForDb, passForDb);

  let results:any;

  const data:string[]|undefined = condition?.flatMap((element) => element.value);

  try {
    results = await POOL.query(createSelect(table, condition, columns, groupBy), data);
    results = results.rows;
  } catch (e:any) {
    results = errorCodeMessage(e.code);
  }
  return results;
}

/**
 * Creates a simple update SQL statement
 * @author Adam Logan
 * @param { string } table The table to update the data in
 * @param { string[] } columns The columns that are being changed
 * @param { string[] } [data] The data to change to, must be the same length as the columns array
 * @param { Predicate[] } [conditions] The conditions to decide which rows to update
 * @returns { string } The update SQL statement
 */
export function createUpdate(table:string, columns:string[], data?:string[], conditions?:Predicate[]) : string {
  const FAILEDMSSG:string = "FAILED";
  let query:string = ""

  let updateVals:string[] = columns.map((element:string, index:number) => `${element} = $${index + 1}`);

  if (conditions !== undefined && conditions.length > 0) {
    const conditionStrs = conditions.map((condition, index) => `${condition.column} ${condition.operation} $${index + columns.length + 1}`);
    query += " WHERE " + conditionStrs.join(" AND ");
  }

  query = `UPDATE ${table} SET ${updateVals.concat()}${query} ;`;
  query = (data !== undefined && columns.length !== data.length) ? FAILEDMSSG : query;

  return query;
}

/**
 * Creates a simple SQL insert query, only creates a query with valid syntax but does not check if the content of the query is correct
 * @author Adam Logan
 * @param { string } table The table where the data is required to be inserted
 * @param { string[] } columns The column names that are being inserted
 * @param { string[] } [returnCols] The columns that are returned when the data is inserted
 * @param { string[] } [data] The data to be inserted, must match the length of the 'columns' parameter
 * @param { string } [upsertCol] If a row exists with the same data, the existing row will be updated with the new data
 * @returns { string } A query that inserts data into a table
 */
export function createInsert(table:string, columns:string[], returnCols?:string[], data?:string[]) : string {
  const FAILEDMSSG:string = "FAILED";
  let query:string = "";

  data = columns.map((element:string, index:number) => data === undefined ? `$${index + 1}` : `'${data[index]}'`);

  query = `INSERT INTO ${table} (${columns.concat()}) VALUES (${data.concat()})`;

  query = returnCols !== undefined ? query + `RETURNING ${returnCols.concat()}` : query;

  query = (data !== undefined && columns.length !== data.length) ? FAILEDMSSG : query;

  return query
}

/**
 * Creates a simple delete SQL statement
 * @author Adam Logan
 * @param { string } table The table to delete the data from
 * @param { Predicate[] } [conditions] The conditions to delete the data for
 * @returns { string } The delete SQL statement
 */
export function createDelete(table: string, conditions?:Predicate[]) : string {
  let query:string = `DELETE FROM ${table}`;  

  if (conditions !== undefined && conditions.length > 0) {
    const conditionStrs = conditions.map((condition, index) => {
      if (Array.isArray(condition.value)) {
        return `${condition.column} ${condition.operation} (${condition.value.map((value, index) => `$${index + 1}`).join(", ")})`;
      }
      return `${condition.column} ${condition.operation} $${index + 1}`;
    });
    query += " WHERE " + conditionStrs.join(" AND ");
  }

  return query;
}

/**
 * Fetches all records from a specified table in a database.
 * 
 * @author Adam Logan
 * @param {string} database - The name of the database.
 * @param {string} table - The name of the table from which to fetch the records.
 * @param {string} [userForDb] - The username for the database connection.
 * @param {string} [passForDb] - The password for the database connection.
 * 
 * @returns {Promise<{allData:any[]}|string>} A promise that resolves with all records from the specified table or an error message.
 */
export async function getAll(database:string, table:string, userForDb?:string, passForDb?:string): Promise<{allData:any[]}|string> {
  const POOL = createPool(database, userForDb, passForDb);

  let results:any;

  try {
    results = await POOL.query(createSelect(table));
    results = {
      allData: results.rows
    };
  } catch (e:any) {
    results = errorCodeMessage(e.code);
  }
  return results;
}

/**
 * Inserts data into the specified table of the database.
 * 
 * @author Adam Logan
 * @param {string} database - The name of the database.
 * @param {string} table - The name of the table.
 * @param {any} dataToAdd - Data to insert into the table.
 * @param {string[]} [returnCols] - Optional array of columns to return after insertion.
 * @param {string} [user="postgres"] - Username for the database.
 * @param {string} [password="postgrespq"] - Password for the database.
 * 
 * @returns {Promise<any>} The result of the insertion operation.
 */
export async function insertData(database:string ,table:string, dataToAdd:any, returnCols?:string[], user="postgres", password="postgrespw"): Promise<any> {
  let role = user === "postgres" ? user : `${user}`;

  const data:string[] = Object.values(dataToAdd);

  const columns:string[] = Object.keys(dataToAdd);

  const POOL = createPool(database, role, password);

  const sqlStatement:string = returnCols !== undefined ? createInsert(table, columns,returnCols) : createInsert(table, columns);

  let results:string;

  try {
    let returnedData = await POOL.query(sqlStatement, data);
    console.log(returnedData);
    results = returnedData.rows[0] !== undefined ? returnedData.rows[0] : "Successfully Inserted the Data 😊";
  } catch (e:any) {
    results = errorCodeMessage(e.code);
  }
  return results;
}

/**
 * Updates data in a specified table of a database.
 *
 * @author Adam Logan
 * @param {string} database - Name of the database to update data in.
 * @param {string} table - Name of the table where the data needs to be updated.
 * @param {any} dataToAdd - Object containing the data fields to be updated.
 * @param {Predicate[]} conditions - Conditions for which rows in the table to update.
 * @param {string} [user] - Username for the database.
 * @param {string} [password] - Password for the database.
 * @returns {Promise<string>} Promise resolving to a success message if the update was successful, or an error message if it wasn't.
 */
export async function updateData(database:string ,table:string, dataToAdd:any, conditions:Predicate[], user?:string, password?:string): Promise<string> {  
  const data:string[] = Object.values(dataToAdd);

  const columns:string[] = Object.keys(dataToAdd);

  const POOL = createPool(database, user, password);

  const sqlStatement:string = createUpdate(table, columns, data, conditions);

  let results:string;

  try {
    await POOL.query(sqlStatement, [...data, ...conditions.flatMap(condition => condition.value)]);
    results = "Successfully Updated the Data 😊";
  } catch (e:any) {
    results = errorCodeMessage(e.code);
  }
  return results;
}

/**
 * Deletes data from a specified table of a database.
 *
 * @author Adam Logan
 * @param {string} database - Name of the database to delete data from.
 * @param {string} table - Name of the table where the data needs to be deleted.
 * @param {Predicate[]} conditions - Conditions specifying which rows to delete.
 * @param {string} [user="postgres"] - Username for the database.
 * @param {string} [password="postgrespw"] - Password for the database.
 * @returns {Promise<string>} Promise resolving to a success message if the deletion was successful, or an error message if it wasn't.
 */
export async function deleteData(database:string ,table:string, conditions:Predicate[], user="postgres", password="postgrespw"): Promise<string> {
  let role = user === "postgres" ? user : `${user}`;

  const POOL = createPool(database, role, password);

  const sqlStatement:string = createDelete(table, conditions);

  console.log(sqlStatement);

  let results:string;

  try {
    await POOL.query(sqlStatement, conditions.flatMap(condition => condition.value));
    results = "Successfully Deleted the Data 😊";
  } catch (e:any) {
    results = errorCodeMessage(e.code);
  }
  return results;
}

/**
 * Copies a table to a table in another database
 * @param {string} sourceDatabase The name of the database to copy the table from
 * @param {string} destinationDatabase The name of the database to copy the table to
 * @author Ewan Forsythe
 * @param {string} database The name of the database to copy the table from
 * @param {string} sourceTable The name of the table to copy
 * @param {string} destinationTable The name of the table to insert the data into
 * @param {string} [user="postgres"] Username for the database
 * @param {string} [password="postgrespw"] Password for the database
 * @returns {Promise<string>} A Promise that resolves to a success message if the copy was successful, or an error message if it wasn't
 */
export async function copyTable(sourceDatabase: string, destinationDatabase: string, sourceTable: string, destinationTable: string, user: string = 'postgres', password: string = 'postgrespw'): Promise<string> {
  let role = user === "postgres" ? user : `${user}`;
  const sourceDb = createPool(sourceDatabase, role, password);
  const destinationDb = createPool(destinationDatabase, role, password);

  try {
    // Delete the content of the destination table and any tables that reference it
    await destinationDb.query(`TRUNCATE TABLE ${destinationTable} CASCADE`);

    // Fetch all records from the source table
    const sourceData = await sourceDb.query(`SELECT * FROM ${sourceTable}`);
    
    // Iterate over the fetched records
    for (let record of sourceData.rows) {
      // Prepare an insert query
      const columns = Object.keys(record).join(', ');
      const values = Object.values(record).map(value => {
        if (value === null) {
          return 'NULL';
        } else if (types.isDate(value)) {
          return `'${value.toISOString().split('T')[0]}'`; // format date as 'YYYY-MM-DD'
        } else {
          return `'${value}'`;
        }
      }).join(', ');
      const insertQuery = `INSERT INTO ${destinationTable} (${columns}) VALUES (${values})`;

      // Execute the insert query on the destination database
      await destinationDb.query(insertQuery);
    }

    return "Successfully copied the table 😊";
  } catch (e:any) {
    return errorCodeMessage(e.code);
  }
}