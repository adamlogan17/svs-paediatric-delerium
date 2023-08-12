import { createInsert, createPool } from './crud';
import { hashPassword } from './login';
import errorCodeMessage from './errorCodeMessage';

const DATABASE = "audit";
const DBPASSWORD:string = "password";

/**
 * Represents the attributes of a PICU (Pediatric Intensive Care Unit) record.
 */
type Picu = {
  hospital_name:string, 
  auditor:string, 
  picu_role:'picu'|'admin'|'field_engineer',
  password:string
  ward_name:string
}

/**
 * Adds a new PICU record to the database.
 * 
 * @author Adam Logan
 * @function addPicu
 * @param {Picu} dataToAdd - The data of the PICU record to be added.
 * @returns {Promise<{id: number} | string>} The ID of the added record or an error message.
 */
export async function addPicu(dataToAdd:Picu): Promise<{id:number}|string> {
  const TABLENAME:string = 'picu';
  const COLUMNS:string[] = Object.keys(dataToAdd) as (keyof Picu)[];

  // Hash the password before storing it
  dataToAdd.password = await hashPassword(dataToAdd.password);

  const DATA:string[] = Object.values(dataToAdd);
  
  const USER = "admin_role";

  const POOL = createPool(DATABASE, USER, DBPASSWORD);

  const sqlStatement:string = createInsert(TABLENAME, COLUMNS, DATA);

  try {
    return {
      id:(await POOL.query(sqlStatement)).rows[0].picu_id
    }
  } catch (e:any) {
    return errorCodeMessage(e.code);
  }
}