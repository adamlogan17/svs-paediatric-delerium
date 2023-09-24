import { createInsert, createPool, createSelect, deleteData, insertData } from './crud';
import { hashPassword } from './login';
import errorCodeMessage from './errorCodeMessage';

const DATABASE = "audit";
const DBPASSWORD:string = "password";

/**
 * @typedef Picu
 * 
 * Represents a PICU (Paediatric Intensive Care Unit) entity in the system. This can be used for
 * storing information related to a particular PICU.
 * 
 * @property {string} hospital_name - The name of the hospital where the PICU is located.
 * @property {string} ward_name - The specific name of the PICU ward.
 * @property {string} picu_role - Role assigned within the PICU database.
 * @property {string} auditor - The individual responsible for auditing within this PICU.
 * @property {string} password - Password associated with the PICU, possibly for access control.
 * @property {string} [picu_id] - Optional unique identifier for the PICU.
 */
type Picu = {
  hospital_name:string, 
  auditor:string, 
  picu_role:'picu'|'admin'|'field_engineer',
  password:string
  ward_name:string,
  picu_id?:string
}

export async function deletePicus(ids:number[], role:string): Promise<string> {
  console.log(ids.join());
  return await deleteData(DATABASE, 'picu', `picu_id IN (${ids.join()})`, role, DBPASSWORD);
}

/**
 * Adds a new PICU record to the database.
 * 
 * @author Adam Logan
 * @function addPicu
 * @param {Picu} dataToAdd - The data of the PICU record to be added.
 * @returns {Promise<{picu_id: number} | string>} The ID of the added record or an error message.
 */
export async function addPicu(dataToAdd:Picu, role:string): Promise<{picu_id:number}|string> {
  const table:string = 'picu';
  const columnsToReturn = ['picu_id'];

  for (const [key, value] of Object.entries(dataToAdd)) {
    if (value === '') {
      return `ERROR: ${key} is empty.`;
    }
  }

  // Hash the password before storing it
  dataToAdd.password = await hashPassword(dataToAdd.password);

  // checks if an error was returned from the hashing function
  if(dataToAdd.password.length !== 60 || dataToAdd.password.includes("Error")) {
    return dataToAdd.password;
  }

  return await insertData(DATABASE, table, dataToAdd, columnsToReturn, role, DBPASSWORD);
}

/**
 * Retrieves the next PICU ID from the database sequence.
 * 
 * @function nextPicu
 * @author Adam Logan
 * @param {string} role - The role for which the database pool will be created.
 * @returns {Promise<number>} - The next value in the sequence.
 */
export async function nextPicu(role:string) {
  const POOL = createPool(DATABASE, role + "_role", DBPASSWORD);

  return (await POOL.query("SELECT nextval('picu_picu_id_seq');")).rows[0].nextval;
}

/**
 * Retrieves all the PICU IDs based on a given role.
 * 
 * The returned IDs are filtered based on 
 * the user's role to provide only relevant entries.
 * 
 * @function getAllIds
 * @author Adam Logan
 * @param {string} role - The role for which the database pool will be created.
 * @returns {Promise<{picu_id:string,picu_role:string}[]>} - An array of relevant PICU IDs.
 */
export async function getAllIds(role:string): Promise<{picu_id:string, picu_role:string}[]> {
  const POOL = createPool(DATABASE, role + "_role", DBPASSWORD);

  const sqlStatement = createSelect("picu", "", ["picu_id", "picu_role"]);

  const allIds = (await POOL.query(sqlStatement)).rows;

  return allIds.filter((id:any) => {
    if (role === "admin") {
      return true;
    }
    else if (role === "field_engineer") {
      return id.picu_role === "picu";
    }
  });
}