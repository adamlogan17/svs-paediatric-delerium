import { createPool, createSelect, deleteData, insertData, updateData } from './crud';
import { hashPassword } from './login';

const db:string = process.env.DATABASE || "No database found";
const dbPassword:string = process.env.DBPASSWORD || "No password found";

/**
 * @typedef Picu
 * 
 * Represents a PICU (Paediatric Intensive Care Unit) entity in the system. This can be used for
 * storing information related to a particular PICU.
 * 
 * @property {string} hospital_name - The name of the hospital where the PICU is located.
 * @property {string} ward_name - The specific name of the PICU ward.
 * @property {string} picu_role - Role assigned within the PICU, within the database.
 * @property {string} auditor - The individual responsible for auditing within this PICU.
 * @property {string} [password] - Password associated with the PICU, possibly for access control.
 * @property {string|number} [picu_id] - Optional unique identifier for the PICU.
 * @property {number|null} [overall_compliance] - Optional overall compliance score for the PICU, which is calculated within the database.
 * @property {number|null} [delirium_positive_patients] - Optional average of the number of patients that are delirium positive
 */
type Picu = {
  hospital_name:string, 
  auditor:string, 
  picu_role:'picu'|'admin'|'field_engineer',
  password?:string
  ward_name:string,
  picu_id?:string,
  overall_compliance?:number,
  delirium_positive_patients?:number|null
}

/**
 * Updates a PICU record in the database.
 * 
 * @function editPicu
 * @author Adam Logan
 * @param {Picu} dataToEdit - An object containing the data to edit for a specific PICU, must include the picu_id.
 * @param {string} role - The role for which the database pool will be created. 
 * @returns {Promise<string>} - A message indicating the success or failure of the update.
 */
export async function editPicu(dataToEdit:Picu, role:string): Promise<string> {
  for (const [key, value] of Object.entries(dataToEdit)) {
    if (key === 'password') {
      return `ERROR: ${key} cannot be edited.`;
    }

    if (value === '') {
      return `ERROR: ${key} is empty.`;
    }
  }

  // Extract picu_id and remove it from the data to be edited
  const id = dataToEdit.picu_id;
  delete dataToEdit.picu_id;
  delete dataToEdit.overall_compliance;

  return await updateData(db, 'picu', dataToEdit, `picu_id = ${Number(id)}`, role, dbPassword);
}

/**
 * Deletes a selection of PICUs from the database.
 * 
 * @function deletePicus
 * @author Adam Logan
 * @param {number[]} ids - The IDs of the PICUs to be deleted.
 * @param {string} role - The role for which the database pool will be created. 
 * @returns {Promise<string>} A message indicating the success or failure of the deletion.
 */
export async function deletePicus(ids:number[], role:string): Promise<string> {
  return await deleteData(db, 'picu', `picu_id IN (${ids.join()})`, role, dbPassword);
}

/**
 * Adds a new PICU record to the database.
 * 
 * @author Adam Logan
 * @function addPicu
 * @param {Picu} dataToAdd - The data of the PICU record to be added.
 * @param {string} role - The role for which the database pool will be created. 
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

  if(dataToAdd.password === undefined) {
    return `ERROR: password is empty.`;
  }

  // Hash the password before storing it
  dataToAdd.password = await hashPassword(dataToAdd.password);

  // checks if an error was returned from the hashing function
  if(dataToAdd.password.length !== 60 || dataToAdd.password.includes("Error")) {
    return dataToAdd.password;
  }

  return await insertData(db, table, dataToAdd, columnsToReturn, role, dbPassword);
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
  const POOL = createPool(db, role + "_role", dbPassword);

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
  const POOL = createPool(db, role + "_role", dbPassword);

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