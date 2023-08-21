import { createInsert, createPool, insertData } from './crud';
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
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+)(?=.*\d).{8}$/;
  if (!passwordRegex.test(dataToAdd.password)) {
    return "ERROR: Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter and one number.";
  }

  // Hash the password before storing it
  dataToAdd.password = await hashPassword(dataToAdd.password);

  return await insertData(DATABASE, table, dataToAdd, columnsToReturn, role, DBPASSWORD);
}