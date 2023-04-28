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

    // createSelect("compliance_data", condition,  ["entry_date", "score"]

    POOL.query(createSelect("compliance_data", condition, ["entry_date", "AVG(score)"], "entry_date"), (error:any, results:any) => {
        if (error) {
            throw error;
        }

        let data = results.rows;

        // sorts the data in ascending order by date
        data.sort((a:{entry_date:Date, avg:string},b:{entry_date:Date, avg:string})=>a.entry_date.getTime()-b.entry_date.getTime());

        response.send({
            entryDates: data.map((singleEntry:{entry_date:Date}) => singleEntry.entry_date),
            complianceScore: data.map((singleEntry:{avg:string}) => Math.round(parseFloat(singleEntry.avg) * 1e2)/1e2)
        });
        
    });
}

/**
 * Gets the anonymised overall compliance score for each PICU
 * @author Adam Logan
 * @date 2023-04-12
 * @param { Request } request
 * @param { Response } response An anonymised array of the overall compliance score along with suggested label
 * @returns { void }
 * TODO Retain the correct ID for the site which requested the data
 */
export function allPicuCompliance(request: Request, response: Response): void {
    const POOL = createPool("audit", "admin_role", "password");

    POOL.query(createSelect("picu", undefined, ["overall_compliance"]), (error:any, results:any) => {
        if (error) {
            throw error;
        }

        let data = results.rows;

        // Shuffles the array of overall compliance scores and rounds these scores
        let anonymised = shuffleArray(data.map((singleEntry:{overall_compliance:string}) => Math.round(parseFloat(singleEntry.overall_compliance) * 1e2)/1e2));

        response.send({
            // assigns a site number for the anonymised sites
            siteNum: anonymised.map((score, i) => i+1),
            complianceScore: anonymised
        });
        
    });
}

/**
 * Shuffles an array using the Fisher–Yates algorithm
 * @author Adam Logan
 * @date 2023-04-12
 * @param { any[] } array The array to be shuffled
 * @returns { any[] } The shuffled array
 */
function shuffleArray(array:any[]): any[] {
    for (let i:number = array.length - 1; i > 0; i--) {
        const j:number = Math.floor(Math.random() * (i + 1));
        const temp:any = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
