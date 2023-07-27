import { Request, Response } from "express";
import { createInsert, createPool } from "./crud";


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