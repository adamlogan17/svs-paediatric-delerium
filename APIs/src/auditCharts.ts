import { Request, Response } from "express";
import { createPool, createSelect } from "./crud";

/**
 * Gets the entry dates and compliance score in the correct format to be displayed on a chart.js graph
 * @author Adam Logan
 * @date 2023-04-12
 * @param { Request } request The site number of the PICU 
 * @param { Response } response Contains 2 arrays both linked by their order
 * @returns { void }
 */
export function singlePicuCompliance(request: Request, response: Response): void {
    const POOL = createPool("audit", "admin_role", "password");

    let condition:string = "picu_id=" + request.params.siteId;

    POOL.query(createSelect("compliance_data", condition, ["entry_date", "score"]), (error:any, results:any) => {
        if (error) {
            throw error;
        }

        let data = results.rows;

        let dates = data.map((singleEntry:{entry_date:string, score:string}) => singleEntry.entry_date);
        let compScores = data.map((singleEntry:{entry_date:string, score:string}) => singleEntry.score);

        response.send({
            entryDates: dates,
            complianceScore: compScores
        });
        
    });
}