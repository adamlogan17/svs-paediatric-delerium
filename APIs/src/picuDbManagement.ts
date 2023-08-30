import { createInsert, createPool, insertData } from './crud';
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

  // Checks the password is valid
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+)(?=.*\d).{8,}$/;
  if (!passwordRegex.test(dataToAdd.password)) {
    return "ERROR: Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter and one number.";
  }

  // Hash the password before storing it
  dataToAdd.password = await hashPassword(dataToAdd.password);

  return await insertData(DATABASE, table, dataToAdd, columnsToReturn, role, DBPASSWORD);
}

export async function nextPicu(role:string) {
  const POOL = createPool(DATABASE, role + "_role", DBPASSWORD);

  return (await POOL.query("SELECT nextval('picu_picu_id_seq');")).rows[0].nextval;
}