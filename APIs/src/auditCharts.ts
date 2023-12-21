import { createPool, createSelect } from "./crud";
import { config } from 'dotenv';
import errorCodeMessage from "./errorCodeMessage";
import { linearRegression, linearRegressionLine } from 'simple-statistics';
import * as tf from '@tensorflow/tfjs';


config();

// const testData:{entryDates:any, complianceScore:any} = {
//   entryDates: [
//     "2015-02-05T00:00:00.000Z",
//     "2015-04-27T00:00:00.000Z",
//     "2015-07-05T00:00:00.000Z",
//     "2015-07-06T00:00:00.000Z",
//     "2015-08-21T00:00:00.000Z",
//     "2015-09-21T00:00:00.000Z",
//     "2016-01-10T00:00:00.000Z",
//     "2016-08-06T00:00:00.000Z",
//     "2016-09-10T00:00:00.000Z",
//     "2016-10-27T00:00:00.000Z",
//     "2017-01-15T00:00:00.000Z",
//     "2017-03-30T00:00:00.000Z",
//     "2017-05-08T00:00:00.000Z",
//     "2017-05-10T00:00:00.000Z",
//     "2017-07-17T00:00:00.000Z",
//     "2018-02-11T00:00:00.000Z",
//     "2018-05-26T00:00:00.000Z",
//     "2019-01-23T00:00:00.000Z",
//     "2019-02-06T00:00:00.000Z",
//     "2019-02-22T00:00:00.000Z",
//     "2019-06-25T00:00:00.000Z",
//     "2019-10-31T00:00:00.000Z",
//     "2020-01-24T00:00:00.000Z",
//     "2020-07-19T00:00:00.000Z",
//     "2021-02-02T00:00:00.000Z",
//     "2021-02-19T00:00:00.000Z",
//     "2022-01-21T00:00:00.000Z",
//     "2022-03-14T00:00:00.000Z",
//     "2022-08-11T00:00:00.000Z",
//     "2022-09-09T00:00:00.000Z",
//     "2023-01-20T00:00:00.000Z",
//     "2023-02-03T00:00:00.000Z",
//     "2023-06-30T00:00:00.000Z",
//     "2023-07-23T00:00:00.000Z",
//     "2023-10-07T00:00:00.000Z",
//     "2023-12-18T00:00:00.000Z"
//   ],
//   complianceScore: [
//     60,
//     0,
//     40,
//     60,
//     40,
//     0,
//     0,
//     60,
//     0,
//     0,
//     0,
//     60,
//     0,
//     0,
//     40,
//     0,
//     0,
//     0,
//     0,
//     0,
//     0,
//     40,
//     0,
//     80,
//     0,
//     100,
//     0,
//     60,
//     0,
//     0,
//     60,
//     0,
//     40,
//     0,
//     0,
//     70
//   ]
// }

const db:string = process.env.DATABASE || "No database found";
const dbPassword:string = process.env.DBPASSWORD || "No password found";
const complianceTableName = "compliance_data";
const picuTableName = "picu";
type possibleDataPoints = "delirium_positive_patients"|"overall_compliance";

// predictiveAnalysis("picu", 1, new Date("2024-12-18T00:00:00.000Z"));

// export async function predictiveAnalysis(role:string, siteId:number, endDate:Date):Promise<{entryDates:Date[], complianceScore:number[]}|string> {
//   // const currentScores = await singlePicuCompliance(role, siteId);
//   const currentScores = testData;

//   if (typeof currentScores === "string") return currentScores;

//   for (let i = 0; i < currentScores.entryDates.length; i++) {
//     currentScores.entryDates[i] = new Date(currentScores.entryDates[i]);
//   }

//   // Prepare the data for TensorFlow.js
//   const xs = tf.tensor1d(currentScores.entryDates.map((date:any) => date.getTime()));
//   const ys = tf.tensor1d(currentScores.complianceScore);

//   // Define a model for linear regression
//   const model = tf.sequential();
//   model.add(tf.layers.dense({units: 1, inputShape: [1]}));

//   // Compile the model
//   model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});

//   // Train the model
//   await model.fit(xs, ys);

//   // Calculate the predictions
//   const predictions = currentScores;
//   let currentDate = new Date();
//   while (currentDate <= endDate) {
//     const predictionTensor = model.predict(tf.tensor1d([currentDate.getTime()])) as tf.Tensor;
//     const prediction = predictionTensor.dataSync()[0];
//     predictions.entryDates.push(new Date(currentDate));
//     predictions.complianceScore.push(Math.round(prediction * 1e2)/1e2);    

//     // Increment the date by 7 days
//     currentDate.setDate(currentDate.getDate() + 7);
//   }

//   console.log(predictions);
//   return predictions;
// }

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

/**
 * Returns compliance data for a single PICU in a format that is friendly to 
 */
export async function sinlgeDataPointAllPicu(role:string, dataPoint:possibleDataPoints):Promise<{dataPoint:number[], picuId:number[]}|string> {
  const POOL = createPool(db, role, dbPassword);

  let condition:string = "picu_role='picu'";

  console.log(createSelect(picuTableName, condition, ["picu_id", dataPoint]));

  try {
    const dbResult = await POOL.query(createSelect(picuTableName, condition, ["picu_id", dataPoint]));
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
