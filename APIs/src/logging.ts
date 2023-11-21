import { getAll } from "./crud";

const db:string = process.env.DATABASE || "No database found";
const dbPassword:string = process.env.DBPASSWORD || "No password found";
const tableName:string = 'api_log';

/**
 * Gets all the information stored within the log table
 * 
 * @author Adam Logan
 * @function getLogData
 * @param role The role which will be accessing the data
 * 
 * @returns The data within the log table
 * 
 * @todo sort out the types for the data
 */
export async function getLogData(role:string): Promise<{allData:any[]}|string> {
  let result:{allData:any[]}|string = await getAll(db, tableName, role, dbPassword);
  return result;
}