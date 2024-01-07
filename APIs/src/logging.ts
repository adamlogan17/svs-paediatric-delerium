import { getAll, insertData } from "./crud";

const db:string = process.env.DATABASE || "No database found";
const dbPassword:string = process.env.DBPASSWORD || "No password found";
const tableName:string = 'api_log';

export type EndpointLog = {
  datetime: Date;
  method: string;
  endpoint: string;
  status_code: number;
  user_ip: string;
  user_agent: string;
  user_role: string;
  username: string;
}

/**
 * Gets all the information stored within the log table
 * 
 * @author Adam Logan
 * @function getLogData
 * @param { string } role sThe role which will be accessing the data
 * 
 * @returns The data within the log table
 * 
 * @todo sort out the types for the data
 */
export async function getLogData(role:string): Promise<{allData:any[]}|string> {
  let data:{allData:any[]}|string = await getAll(db, tableName, role, dbPassword);
  if (typeof data !== 'string') {
    data.allData = data.allData.map(item => {
      const { log_id, ...rest } = item;
      return rest;
    });
  }
  return data;
}

/**
 * Adds a log into the database
 * 
 * @author Adam Logan
 * @function logEndpoint
 * 
 * @param { EndpointLog } endpointDetails The data to log
 */
export async function logEndpoint(endpointDetails:EndpointLog):Promise<void> {
  if(endpointDetails.method !== "OPTIONS") {
    await insertData(db, tableName, endpointDetails);
  }
}