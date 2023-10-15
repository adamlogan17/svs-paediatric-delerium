import { Request, Response } from "express";
import { createInsert, createPool, updateData } from "./crud";
import { config } from 'dotenv';

config();

const db:string = process.env.DATABASE || "No database found";
const dbPassword:string = process.env.DBPASSWORD || "No password found";

type ComplianceData = {
  comp_id?: number,
  entry_date: Date,
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
 * @date 2023-04-28
 * @param { Request } request - Requires the username and role of the user
 * @param { Response } response - A message detailing if the data has been inserted or not
 * @returns { void }
 * TODO copy the 'addPicu' and accept a json with key value pairs of rows and the data to be entered
 */
export function insertCompData(request: Request, response: Response): void {
  const { data } = request.body;

  // the columns of the data to be inserted 
  const columns:string[] = ["correct_details", 
    "comfort_recorded", "comfort_above", "all_params_scored", "totalled_correctly", 
    "in_score_range", "observer_name", "bed_number", "method", "picu_id", "entry_date"]

  // Adds the current username and date to the end of the data to be inserted into the database
  data.push(request.params.username);
  data.push(new Date().toJSON());

  const POOL = createPool("audit", request.params.role + "_role", "password");
  
  POOL.query(createInsert("compliance_data", columns, data), (error:any, results:any) => {
    if(error == undefined) {
      response.send("Successfully Inserted the Data 😊");
    }
    else if (error.code == 42501) {
      response.send("Invalid user");
    } else {
      console.log(error);
      response.send(error);
    }
  });
}

export async function editCompliance(dataToEdit:ComplianceData, role:string): Promise<string> {
  const id = dataToEdit.comp_id;
  delete dataToEdit.comp_id;
  delete dataToEdit.score;

  console.log(process.env.DATABASE);

  return await updateData(db, 'compliance_data', dataToEdit, `comp_id = ${Number(id)}`, role, dbPassword);
}