import { Request, Response } from "express";
import { createInsert, createPool } from "./crud";


export function insertCompData(request: Request, response: Response): void {
    const { table, data } = request.body;

    const columns:string[] = ["correct_details", 
        "comfort_recorded", "comfort_above", "all_params_scored", "totalled_correctly", 
        "in_score_range", "observer_name", "bed_number", "method", "picu_id", "entry_date"]

    data.push(request.params.username);
    data.push(new Date().toJSON())
  
    const POOL = createPool(request.params.database, request.params.role + "_role", "password");

    console.log(createInsert(table, columns, data));
    
    POOL.query(createInsert(table, columns, data), (error:any, results:any) => {
      if(error == undefined) {
        console.log("success");
        response.send("Successfully Inserted the Data 😊");
      }
      else if (error.code == 42501) {
        console.log("inval user");
        response.send("Invalid user");
      } else {
        console.log(error);
        response.send(error);
      }
    });
  }