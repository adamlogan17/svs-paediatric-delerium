import { Request, Response } from "express";
import { createPool, createSelect } from "./crud";
import { config } from 'dotenv';
import errorCodeMessage from "./errorCodeMessage";

config();

const db:string = process.env.DATABASE || "No database found";
const dbPassword:string = process.env.DBPASSWORD || "No password found";
const complianceTableName = "compliance_data";
const picuTableName = "picu";
type possibleDataPoints = "delirium_positive_patients"|"overall_compliance";

export async function singlePicuCompliance(role:string, siteId:number):Promise<{entryDates:Date[], complianceScore:number[]}|string> {
  const POOL = createPool(db, role, dbPassword);

  let condition:string = `picu_id=${siteId}`;

  try {
    const dbResult = await POOL.query(createSelect(complianceTableName, condition, ["entry_date", "AVG(score)"], "entry_date"));
    const data = dbResult.rows;
    data.sort((a:{entry_date:Date, avg:string},b:{entry_date:Date, avg:string})=>a.entry_date.getTime()-b.entry_date.getTime());
    return {
      entryDates: data.map((singleEntry:{entry_date:Date}) => singleEntry.entry_date),
      complianceScore: data.map((singleEntry:{avg:string}) => Math.round(parseFloat(singleEntry.avg) * 1e2)/1e2)
    };

  } catch (error:any) {
    return errorCodeMessage(error.code);
  }
}

export async function sinlgeDataPointallPicu(role:string, dataPoint:possibleDataPoints):Promise<{dataPoint:number[], picuId:number[]}|string> {
  const POOL = createPool(db, role, dbPassword);

  try {
    const dbResult = await POOL.query(createSelect(picuTableName, undefined, ["picu_id", dataPoint]));
    const data = dbResult.rows;
    console.log(data);
    // data.sort((a:{picu_id:number},b:{picu_id:number, avg:string})=>a.picu_id-b.picu_id);
    const sortedData = data.sort((a:{picu_id:number},b:{picu_id:number})=>a.picu_id-b.picu_id);

    return {
      picuId: sortedData.map((singleEntry:{picu_id:number}) => singleEntry.picu_id),
      dataPoint: sortedData.map((singleEntry:any) => singleEntry[dataPoint] === null ? 0 : Math.round(parseFloat(singleEntry[dataPoint]) * 1e2)/1e2)
    };

  } catch (error:any) {
    return errorCodeMessage(error.code);
  }
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
