import { retrieveData } from "./crud";
import { config } from 'dotenv';
import errorCodeMessage from "./errorCodeMessage";
import { linearRegression, linearRegressionLine } from 'simple-statistics';

config();

const db:string = process.env.DATABASE || "No database found";
const dbPassword:string = process.env.DBPASSWORD || "No password found";
const complianceTableName = "compliance_data";
const picuTableName = "picu";
type possibleDataPoints = "delirium_positive_patients"|"overall_compliance";

export async function predictiveAnalysis(role:string, siteId:number, endDate:Date):Promise<{entryDates:Date[], complianceScore:number[]}|string> {
  const currentScores = await singlePicuCompliance(role, siteId);

  if (typeof currentScores === "string") return currentScores;

  for (let i = 0; i < currentScores.entryDates.length; i++) {
    currentScores.entryDates[i] = new Date(currentScores.entryDates[i]);
  }

  // Calculate the linear regression line
  const test = linearRegression(currentScores.entryDates.map((element, index) => [element.getTime(), currentScores.complianceScore[index]]));
  const regressionLine = linearRegressionLine(test);

  // Calculate the predictions
  const predictions = currentScores;
  console.log(endDate);
  let currentDate = new Date();
  while (currentDate <= endDate) {
    const prediction = regressionLine(currentDate.getTime());
    console.log(prediction);
    predictions.entryDates.push(new Date(currentDate));
    predictions.complianceScore.push(Math.round(prediction * 1e2)/1e2);    

    // Increment the date by 7 days
    currentDate.setDate(currentDate.getDate() + 7);
  }
  return predictions;
}

/**
 * Retrieves compliance data for a single PICU in a format that is supported by Chart.js graphs.
 *
 * @author Adam Logan
 * @param {string} role - The role associated with the user accessing the data.
 * @param {number} siteId - The ID of the PICU for which compliance data is requested.
 * @returns {Promise<{entryDates: Date[], complianceScore: number[] } | string>} - A promise that resolves to an object containing entry dates and compliance scores or an error message.
 */
export async function singlePicuCompliance(role:string, siteId:number):Promise<{entryDates:Date[], complianceScore:number[]}|string> {
  const condition:any[] = [{
    column: "picu_id",
    operation: "=",
    value: siteId
  }];

  try {
    const dbResult = await retrieveData(db, complianceTableName, role, dbPassword, condition, ["entry_date", "AVG(score)"], "entry_date");
    if(typeof dbResult === "string") return dbResult;

    dbResult.sort((a:{entry_date:Date, avg:string},b:{entry_date:Date, avg:string})=>a.entry_date.getTime()-b.entry_date.getTime());
    return {
      entryDates: dbResult.map((singleEntry:{entry_date:Date}) => singleEntry.entry_date),
      complianceScore: dbResult.map((singleEntry:{avg:string}) => Math.round(parseFloat(singleEntry.avg) * 1e2)/1e2)
    };

  } catch (error:any) {
    return errorCodeMessage(error.code);
  }
}

/**
 * Returns data points for a specified type across all PICUs in a format suitable for Chart.js graphs.
 *
 * @function sinlgeDataPointAllPicu
 * @param {string} role - The role associated with the user accessing the data.
 * @param {possibleDataPoints} dataPoint - The type of data point requested.
 * @returns {Promise<{dataPoint: number[], picuId: number[] } | string>} - A promise that resolves to an object containing data points and PICU IDs or an error message.
 */
export async function sinlgeDataPointAllPicu(role:string, dataPoint:possibleDataPoints):Promise<{dataPoint:number[], picuId:number[]}|string> {
  const condition:any[] = [{
    column: "picu_role",
    operation: "=",
    value: "picu"
  }];

  try {
    const dbResult = await retrieveData(db, picuTableName, role, dbPassword, condition, ["picu_id", dataPoint]);
    if(typeof dbResult === "string") return dbResult;

    const sortedData = dbResult.sort((a:{picu_id:number},b:{picu_id:number})=>a.picu_id-b.picu_id);

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
