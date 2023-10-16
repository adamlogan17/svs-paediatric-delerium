import { Request, Response } from "express";
import { createInsert, createPool, deleteData, insertData, updateData } from "./crud";
import { config } from 'dotenv';

config();

const db:string = process.env.DATABASE || "No database found";
const dbPassword:string = process.env.DBPASSWORD || "No password found";
const tableName = "compliance_data";

/**
 * @typedef ComplianceData
 * 
 * Represents a compliance record within the system, which is used to store
 * data related to certain standards or metrics of care.
 * 
 * @property {number} [comp_id] - Optional unique identifier for the compliance record.
 * @property {Date} [entry_date] - The date the record was entered into the system.
 * @property {'SOSPD' | 'CAPD'} method - The method used, either SOSPD or CAPD.
 * @property {number} bed_number - Identifier for the bed associated with the record.
 * @property {boolean} correct_details - Whether the correct details were provided.
 * @property {boolean} comfort_recorded - Whether comfort was recorded for the patient.
 * @property {boolean} comfort_above - Whether the comfort recorded was above a certain threshold.
 * @property {boolean} all_params_scored - Whether all parameters were scored.
 * @property {boolean} totalled_correctly - Whether scores were totalled correctly.
 * @property {boolean} in_score_range - Whether the score was in the acceptable range.
 * @property {boolean} observer_name - Whether the observer's name was provided.
 * @property {number} [score] - Optional score, if applicable.
 * @property {number} picu_id - Identifier for the PICU associated with the record.
 */
type ComplianceData = {
  comp_id?: number,
  entry_date?: Date,
  method: 'SOSPD' | 'CAPD',
  bed_number: number,
  correct_details: boolean,
  comfort_recorded: boolean,
  comfort_above: boolean,
  all_params_scored: boolean,
  totalled_correctly: boolean,
  in_score_range: boolean,
  observer_name: boolean,
  score?: number,
  picu_id: number,
};

/**
 * Inserts compliance data into the database
 * @author Adam Logan
 * @todo make sure that the data is being added to an actual PICU, so need to check the role to be PICU
 */
export async function insertCompData(dataToAdd:ComplianceData, role:string): Promise<{comp_id:number}|string> {
  const columnsToReturn = ['comp_id'];

  // The db does not allow for null values and therefore will throw an error if the data is not provided, so no need to check here
  return await insertData(db, tableName, dataToAdd, columnsToReturn, role, dbPassword);
}

/**
 * Edits an existing compliance record in the database.
 * 
 * @function editCompliance
 * @author Adam Logan
 * @param {ComplianceData} dataToEdit - Data fields to be updated for the compliance record, along with the ID of the record to be updated.
 * @param {string} role - User role performing the edit.
 * @returns {Promise<string>} - A promise that indicates if the data has been successfully updated, or if there was an error
 */
export async function editCompliance(dataToEdit:ComplianceData, role:string): Promise<string> {
  const id = dataToEdit.comp_id;

  delete dataToEdit.comp_id; // the id should not change
  delete dataToEdit.score; // the score is updated based on the trigger
  delete dataToEdit.entry_date; // the entry date should not change

  return await updateData(db, tableName, dataToEdit, `comp_id = ${Number(id)}`, role, dbPassword);
}

/**
 * Deletes a selection of compliance records from the database.
 * 
 * @function deleteCompRecords
 * @author Adam Logan
 * @param {number[]} ids - The IDs of the PICUs to be deleted.
 * @param {string} role - The role for which the database pool will be created. 
 * @returns {Promise<string>} A message indicating the success or failure of the deletion.
 */
export async function deleteCompRecords(ids:number[], role:string): Promise<string> {
  return await deleteData(db, tableName, `comp_id IN (${ids.join()})`, role, dbPassword);
}