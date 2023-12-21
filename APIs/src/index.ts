import express, { NextFunction, Request, Response, response } from 'express';
import morgan from "morgan";
import bp from 'body-parser';
import https from 'https';
import fs from 'fs';
import { config } from 'dotenv';


import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { copyTable, deleteData, getAll, insertData, updateData } from './crud';
import { authenticate, authorise, updatePicuPassword, verifyCaptcha } from './login';
import { predictiveAnalysis, singlePicuCompliance, sinlgeDataPointAllPicu } from './auditCharts';
import { addPicu, deletePicus, editPicu, getAllIds, nextPicu, getPicuData } from './picuDbManagement';
import { deleteCompRecords, editCompliance, getComplianceData, insertCompData } from './complianceScores';
import { EndpointLog, getLogData, logEndpoint } from './logging';
import { request } from 'http';
import { exec } from 'child_process';


// initialise process.env
config();


// Express Initialize
const app = express();
const port: number = 8000;
const baseIP:string = process.env.BASE_IP || "localhost";

// apps certs for https
const options = {
  key: fs.readFileSync("server.key"),
  cert: fs.readFileSync("server.cert"),
};

// swagger configuration
const specs = swaggerJsdoc(
  {
    swagger:"3.0",
    definition: {
      info: {
        title: "SvS Backend",
        version: "1.0.0",
        description:"This is the backend for the SvS final year project"
      },
      securityDefinitions: {
          Bearer: {
            type: 'apiKey',
            in: 'header',
            name: 'Authorization',
            description: 'JWT to access the endpoints'
          }
        },
      servers: [
        {
          url: `https://${baseIP}:${port}`
        }
      ]
    },
    apis: ["./src/index.ts"]
  }
);

app.use(
  "/swagger-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);

// logs when an API is called from the app
app.use(morgan("tiny"));

// allows messages to be read from the body of a request
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }));

// Disables CORS errors, for developments
app.use((request:Request, response:Response, next) => {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    response.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
});

app.use((request:Request, response:Response, next:NextFunction) => {
  // forces the middleware to wait until the response has been sent
  response.on('finish', () => {
    const apiCallDetail:EndpointLog = {
      datetime: new Date(),
      method: request.method,
      endpoint: request.originalUrl,
      status_code: response.statusCode,
      user_ip: request.ip,
      user_agent: request.headers['user-agent'] || '',
      username: request.params.username,
      user_role: request.params.role
    };

    logEndpoint(apiCallDetail);
  })
  next();
});

/**
 * @swagger
 * definitions:
 *   Picu:
 *     properties:
 *       picu_id:
 *         type: string
 *       hospital_name:
 *         type: string
 *       auditor:
 *         type: string
 *       picu_role:
 *         type: string
 *         enum:
 *           - picu
 *           - admin
 *           - field_engineer
 *       password:
 *         type: string
 *       ward_name:
 *         type: string
 *   Login:
 *     properties:
 *       username:
 *         type: string
 *       password:
 *         type: string
 *   ComplianceData:
 *     properties:
 *       comp_id:
 *         type: number
 *       entry_date:
 *         type: string
 *         format: date
 *       method:
 *         type: string
 *         enum: ['SOSPD', 'CAPD']
 *       bed_number:
 *         type: number
 *       correct_details:
 *         type: boolean
 *       comfort_recorded:
 *         type: boolean
 *       comfort_above:
 *         type: boolean
 *       all_params_scored:
 *         type: boolean
 *       totalled_correctly:
 *         type: boolean
 *       in_score_range:
 *         type: boolean
 *       observer_name:
 *         type: boolean
 *       picu_id:
 *         type: number
 */

// Routes
/**
 * @swagger
 * /test/{val}:
 *  get:
 *    tags: 
 *      - Testing
 *    summary: Tests the API
 *    description: Tests the API by responding with the value given along with a hello world message
 *    parameters:
 *      - name: val
 *        in: path
 *        description: The value to be returned
 *        schema:
 *          type: "string"
 *    responses:
 *      '200':
 *          description: OK
 */
app.get("/test/:val", (request: Request, response: Response, next:NextFunction) => {
    const body = { hello:"world", val: request.params.val };
    response.status(201).send(body);
});

/**
 * @swagger
 * /test-auth/picu:
 *   get:
 *     tags:
 *       - Testing
 *     summary: Tests authentication
 *     description: Endpoint that requires authorisation.
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Message indicating the user is authorized and the user's details.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *             user:
 *               type: string
 *             role:
 *               type: string
 *       401:
 *         description: Unauthorized access.
 */
app.get("/test-auth/picu", (request: Request, response: Response, next:NextFunction) => authorise(request, response, next, "picu"), (request:any, response:Response) => {
  const body = { message: "You are authorized to access me" , user: request.params.username, role: request.params.role};
  response.status(201).send(body);
});

/**
 * @swagger
 * /test-auth/admin:
 *   get:
 *     tags:
 *       - Testing
 *     summary: Tests Admin authentication
 *     description: Endpoint that requires authorisation.
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Message indicating the user is authorized and the user's details.
 *       401:
 *         description: Unauthorized access.
 */
app.get("/test-auth/admin", (request: Request, response: Response, next:NextFunction) => authorise(request, response, next, "admin"), (request:any, response:Response, next:NextFunction) => {
  const body ={ message: "You are authorized to access me" , user: request.params.username, role: request.params.role};
  response.status(201).send(body);
});

/**
 * @swagger
 * /test-auth/field-engineer:
 *   get:
 *     tags:
 *       - Testing
 *     summary: Tests field engineer authentication
 *     description: Endpoint that requires authorisation.
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Message indicating the user is authorized and the user's details.
 *       401:
 *         description: Unauthorized access.
 */
app.get("/test-auth/field-engineer", (request: Request, response: Response, next:NextFunction) => authorise(request, response, next, "field_engineer"), (request:any, response:Response, next:NextFunction) => {
  const body ={ message: "You are authorized to access me" , user: request.params.username, role: request.params.role};
  response.status(201).send(body);
});

/**
 * @swagger
 * /login:
 *   post:
 *     tags:
 *       - Authorisation
 *     summary: Allows users to log into the system
 *     description: Accepts a username and password and returns a token
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: The username and password to be authenticated
 *         schema:
 *          $ref: '#/definitions/Login'
 *         required:
 *          - username
 *          - password
 *     responses:
 *       200:
 *         description: Successful operation
 *         schema:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *             role:
 *               type: string
 *             username:
 *               type: string
 *       401:
 *         description: Unauthorized - Invalid username or password   
 */
app.post("/login", (request: Request, response: Response, next:NextFunction) => {
  /**
 * Decrypts a string that was encrypted with a Caesar cipher.
 * 
 * This function is necessary because Charles' server cannot use HTTPS. Without HTTPS, data sent to the server is not encrypted, 
 * and could be intercepted by malicious third parties. To protect sensitive data, we use a Caesar cipher to encrypt the data 
 * before sending it to the server. This function is used to decrypt that data.
 * 
 * @author Adam Logan
 *
 * @param {string} cipher - The encrypted string to be decrypted.
 * @returns {string} The decrypted string.
 */
  function caesarDecipher(cipher:string) {
    const shift:number = cipher.length % 26 + 1;
    return cipher.split('').map(char => {
      const charCode = char.charCodeAt(0);
  
      if (charCode >= 65 && charCode <= 90) {
        // Uppercase letters
        return String.fromCharCode((charCode - 65 - shift + 26) % 26 + 65);
      } else if (charCode >= 97 && charCode <= 122) {
        // Lowercase letters
        return String.fromCharCode((charCode - 97 - shift + 26) % 26 + 97);
      } else {
        // Non-letter characters
        return char;
      }
    }).join('');
  }
  
  if(request.body.password.startsWith("cc")) {
    request.body.password = caesarDecipher(request.body.password.substring(2));
  }
  next();
}, authenticate);

/**
 * @swagger
 * /{database}/getall/{table}:
 *  get:
 *    tags:
 *      - CRUD
 *    summary: Gets all data from table
 *    parameters:
 *      - name: database
 *        in: path
 *        description: The name of the selected database
 *        schema:
 *          type: "string"
 *        required: true
 *      - name: table
 *        in: path
 *        description: The name of the selected table
 *        required: true
 *        schema:
 *          type: "string"
 *    responses:
 *      '200':
 *          description: OK
 *      '400':
 *          description: Invalid parameters
 */
app.get("/:database/getall/:table", async (req: Request,res: Response) => {
  let result:{allData:any[]}|string = await getAll(req.params.database, req.params.table, req.params.role === undefined ? "postgres" : `${req.params.role}_role`, req.params.role === undefined ? "postgrespw": "password");
  let status:number = typeof result === 'string' ? 400 : 200;
  res.status(status).send(result);
});

/**
 * @swagger
 * /backupAllData:
 *   post:
 *     summary: Copy data from the api_log table to api_log_backup.
 *     tags:
 *       - Backup
 *     responses:
 *       200:
 *         description: Data successfully copied.
 *       400:
 *         description: There was an error copying the data.
 */
app.post("/backupAllData", async (req, res) => {
  try {
    await copyTable("audit","backup", "picu", "picu_backup");
    await copyTable("audit","backup", "compliance_data", "compliance_data_backup");
    await copyTable("audit","backup", "api_log", "api_log_backup");

    res.status(200).send("Data successfully copied to api_log_backup.");
  } catch (error) {
    console.error(error);
    res.status(400).send("Error copying data.");
  }
});

/**
 * @swagger
 * /backupPicu:
 *   post:
 *     summary: Copy data from the picu table to picu_backup.
 *     tags:
 *       - Backup
 *     responses:
 *       200:
 *         description: Data successfully copied.
 *       400:
 *         description: There was an error copying the data.
 */
app.post("/backupPicu", async (req, res) => {
  try {
    copyTable("audit","backup", "picu", "picu_backup");
    res.status(200).send("Data successfully copied to picu_backup.");
  } catch (error) {
    console.error(error);
    res.status(400).send("Error copying data.");
  }
});

/**
 * @swagger
 * /backupComplianceData:
 *   post:
 *     summary: Copy data from the compliance_data table to compliance_data_backup.
 *     tags:
 *       - Backup
 *     responses:
 *       200:
 *         description: Data successfully copied.
 *       400:
 *         description: There was an error copying the data.
 */
app.post("/backupComplianceData", async (req, res) => {
  try {
    copyTable("audit","backup", "compliance_data", "compliance_data_backup");
    res.status(200).send("Data successfully copied to compliance_data_backup.");
  } catch (error) {
    console.error(error);
    res.status(400).send("Error copying data.");
  }
});

/**
 * @swagger
 * /backupApiLog:
 *   post:
 *     summary: Copy data from the api_log table to api_log_backup.
 *     tags:
 *       - Backup
 *     responses:
 *       200:
 *         description: Data successfully copied.
 *       400:
 *         description: There was an error copying the data.
 */
app.post("/backupApiLog", async (req, res) => {
  try {
    copyTable("audit","backup", "api_log", "api_log_backup");
    res.status(200).send("Data successfully copied to api_log_backup.");
  } catch (error) {
    console.error(error);
    res.status(400).send("Error copying data.");
  }
});



/**
 * @swagger
 * /backupPostgres:
 *   post:
 *     summary: makes a dump of postgres
 *     tags:
 *       - Backup
 *     responses:
 *       200:
 *         description: Data successfully copied.
 *       400:
 *         description: There was an error copying the data.
 */

app.post('/backupPostgres', (req, res) => {
  const command = '/bin/bash -c "docker exec -t dev_svs_postgres pg_dumpall -c -U postgres > dump_manual"';
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      res.status(500).send('Error running backup command.');
      return;
    }
    res.status(200).send('Backup command ran successfully.');
  });
});

/**
 * @swagger
 * /restorePostgres:
 *   post:
 *     summary: Restore a dump of PostgreSQL
 *     tags:
 *       - Restore
 *     responses:
 *       200:
 *         description: Data successfully restored.
 *       500:
 *         description: There was an error restoring the data.
 */

app.post('/restorePostgres', (req, res) => {
  const command = '/bin/bash -c "cat dump_manual | docker exec -i dev_svs_postgres psql -U postgres"';
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      res.status(500).send('Error running restore command.');
      return;
    }
    res.status(200).send('Restore command ran successfully.');
  });
});

/**
 * @swagger
 * /{database}/{table}/insertdata:
 *   post:
 *     summary: Inserts data into the specified database and table.
 *     tags: 
 *       - CRUD
 *     parameters:
 *       - in: path
 *         name: database
 *         required: true
 *         description: Name of the database.
 *         schema:
 *           type: string
 *       - in: path
 *         name: table
 *         required: true
 *         description: Name of the table.
 *         schema:
 *           type: string
 *       - in: body
 *         name: data
 *         required: true
 *         description: The data to insert, with the key being the column name.
 *         schema:
 *           type: object
 *           properties:
 *             data:
 *               type: object
 *               description: The data fields to be inserted
 *             returnCols:
 *               type: array
 *               items:
 *                type: string
 *     responses:
 *       200:
 *         description: Data successfully inserted.
 *       400:
 *         description: There was an error inserting the data.
 */
app.post("/:database/:table/insertdata", async (req: Request,res: Response) => {
  let result:string = req.body.returnCols !== undefined ? await insertData(req.params.database, req.params.table,req.body.data,req.body.returnCols) : await insertData(req.params.database, req.params.table,req.body.data);
  let status:number = typeof result === 'string' ? 400 : 200;
  res.status(status).send(result);
});

/**
 * @swagger
 * /{database}/{table}/updatedata:
 *   put:
 *     summary: Update data in a specific table in a database.
 *     tags:
 *       - CRUD
 *     parameters:
 *       - in: path
 *         name: database
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the database.
 *       - in: path
 *         name: table
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the table.
 *       - in: body
 *         name: data
 *         required: true
 *         description: Data to update.
 *         schema:
 *           type: object
 *           properties:
 *             data:
 *               type: object
 *               description: The data fields to be updated.
 *             predicate:
 *               type: string
 *               description: Condition for which rows to update.
 *     responses:
 *       200:
 *         description: Successfully Updated the Data.
 *       400:
 *         description: Error occurred during the data update.
 */
app.put("/:database/:table/updatedata", async (req: Request,res: Response) => {
  let result:string = await updateData(req.params.database, req.params.table,req.body.data, req.body.predicate);
  let status:number = result.includes("ERROR") ? 400 : 200;
  res.status(status).send(result);
});

/**
 * @swagger
 * /{database}/deletedata/{table}/{predicate}:
 *   delete:
 *     summary: Deletes data from a specified table of a database.
 *     tags:
 *       - CRUD
 *     parameters:
 *       - name: database
 *         in: path
 *         description: Name of the database.
 *         required: true
 *         type: string
 *       - name: table
 *         in: path
 *         description: Name of the table where the data needs to be deleted from.
 *         required: true
 *         type: string
 *       - name: predicate
 *         in: path
 *         description: Condition specifying which rows to delete.
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Data deleted successfully.
 *       400:
 *         description: Error in deleting data.
 */
app.delete("/:database/deletedata/:table/:predicate", async (req: Request,res: Response) => {
  let result:string = await deleteData(req.params.database, req.params.table,req.params.predicate);
  let status:number = result.includes("ERROR") ? 400 : 200;
  res.status(status).send(result);
});

/**
 * @swagger
 * /chart-single-picu-compliance/{siteId}:
 *   get:
 *     tags:
 *       - Compliance
 *     summary: Get compliance data for a single PICU site
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: siteId
 *         in: path
 *         description: ID of the PICU site
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 entryDates:
 *                   type: array
 *                   items:
 *                     type: string
 *                     format: date-time
 *                 complianceScore:
 *                   type: array
 *                   items:
 *                     type: number
 *                     format: float
 *       '400':
 *         description: Invalid site ID supplied
 */
app.get("/chart-single-picu-compliance/:siteId", (request: Request, response: Response, next:NextFunction) => authorise(request, response, next, "picu"), async (req: Request, res: Response) => {
  if(req.params.role === "picu" && Number(req.params.siteId) !== Number(req.params.username)) {
    res.status(401).send("ERROR: Permission Denied");
  } else {
    let result = await singlePicuCompliance(req.params.role, Number(req.params.siteId));
    let status:number = typeof result === 'string' ? 400 : 201;
    res.status(status).send(result);
  }
});

/**
 * @swagger
 * /chart-predict-picu-compliance/{siteId}/{endDate}:
 *   get:
 *     tags:
 *       - Compliance
 *     summary: Get compliance data for a single PICU site
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: siteId
 *         in: path
 *         description: ID of the PICU site
 *         required: true
 *         schema:
 *           type: integer
 *       - name: endDate
 *         in: path
 *         description: The end date of the prediction
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 entryDates:
 *                   type: array
 *                   items:
 *                     type: string
 *                     format: date-time
 *                 complianceScore:
 *                   type: array
 *                   items:
 *                     type: number
 *                     format: float
 *       '400':
 *         description: Invalid site ID supplied
 */
app.get("/chart-predict-picu-compliance/:siteId/:endDate", (request: Request, response: Response, next:NextFunction) => authorise(request, response, next, "picu"), async (req: Request, res: Response) => {
  if(req.params.role === "picu" && Number(req.params.siteId) !== Number(req.params.username)) {
    res.status(401).send("ERROR: Permission Denied");
  } else {
    const endDate:Date = new Date(req.params.endDate);
    let result = await predictiveAnalysis(req.params.role, Number(req.params.siteId), endDate);
    let status:number = typeof result === 'string' ? 400 : 201;
    res.status(status).send(result);
  }
});

/**
 * @swagger
 * /chart-all-picu-compliance:
 *   get:
 *     tags:
 *       - Compliance
 *       - PICU
 *     summary: Get compliance data for all PICU sites
 *     security:
 *       - Bearer: []
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 picuId:
 *                   type: array
 *                   items:
 *                     type: integer
 *                 complianceScore:
 *                   type: array
 *                   items:
 *                     type: number
 *                     format: float
 *       '400':
 *         description: Invalid site ID supplied
 *       '401':
 *         description: Permission Denied
 */
app.get("/chart-all-picu-compliance", (request: Request, response: Response, next:NextFunction) => authorise(request, response, next, "admin"), async (req: Request, res: Response) => {
  let result:any = await sinlgeDataPointAllPicu(req.params.role, 'overall_compliance');
  let status:number = 201;
  if(typeof result === 'string') {
    status = 400 ;
  } else {
    result.complianceScore = result.dataPoint;
    delete result.dataPoint;
  }
  res.status(status).send(result);
});

/**
 * @swagger
 * /chart-all-picu-delirium-positive:
 *   get:
 *     tags:
 *       - PICU
 *     summary: Get the number of patients with positive delirium for all PICU sites
 *     security:
 *       - Bearer: []
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 picuId:
 *                   type: array
 *                   items:
 *                     type: integer
 *                 totalPositiveDelirium:
 *                   type: array
 *                   items:
 *                     type: number
 *                     format: float
 *       '400':
 *         description: Invalid site ID supplied
 *       '401':
 *         description: Permission Denied
 */
app.get("/chart-all-picu-delirium-positive", (request: Request, response: Response, next:NextFunction) => authorise(request, response, next, "admin"), async (req: Request, res: Response) => {
  let result:any = await sinlgeDataPointAllPicu(req.params.role, 'delirium_positive_patients');
  let status:number = 201;
  if(typeof result === 'string') {
    status = 400 ;
  } else {
    result.totalPositiveDelirium = result.dataPoint.map((element:number) => element * 100);
    delete result.dataPoint;
  }
  res.status(status).send(result);
});

/**
 * @swagger
 * /add-compliance:
 *   post:
 *     tags:
 *       - Compliance
 *     summary: Adds a new compliance score to the database
 *     security:
 *       - Bearer: []
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: picu
 *         in: body
 *         schema:
 *           $ref: '#/definitions/ComplianceData'
 *     responses:
 *       '200':
 *         description: PICU successfully added.
 *       '400':
 *         description: Error occurred.
 */
app.post("/add-compliance", (request: Request, response: Response, next:NextFunction) => authorise(request, response, next, "picu"), async (req: Request, res: Response) => {
  if(req.params.role === "picu" && (Number(req.body.picu_id) !== Number(req.params.username) && req.body.picu_id !== undefined)) {
    res.status(401).send("ERROR: Permission Denied");
  } else {
    req.body.picu_id = req.body.picu_id ?? req.params.username;
    let result = await insertCompData(req.body, req.params.role);
    let status:number = result.toString().includes("Error") ? 400 : 201;
    res.status(status).send(result);
  }
});

/**
 * @swagger
 * /addPicu:
 *   post:
 *     tags:
 *       - PICU
 *     summary: Adds a new PICU to the database
 *     security:
 *       - Bearer: []
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: picu
 *         in: body
 *         schema:
 *           $ref: '#/definitions/Picu'
 *         required:
 *           - hospital_name
 *           - auditor
 *           - picu_role
 *           - password
 *           - ward_name
 *     responses:
 *       '200':
 *         description: PICU successfully added.
 *       '400':
 *         description: Error occurred.
 */
app.post("/addPicu", (request: Request, response: Response, next:NextFunction) => authorise(request, response, next, 'admin'), async (req: Request, res: Response) => {
  let result = await addPicu(req.body, req.params.role);
  let status:number = result.toString().includes("Error") ? 400 : 201;
  res.status(status).send(result);
});

/**
 * @swagger
 * /getNextPicu:
 *   get:
 *     tags:
 *       - PICU
 *     summary: Gets the next PICU ID, used when adding a new PICU to the database
 *     security:
 *       - Bearer: []
 *     responses:
 *       '200':
 *         description: The next PICU ID.
 *       '400':
 *         description: Error occurred.
 */
app.get("/getNextPicu", (request: Request, response: Response, next:NextFunction) => authorise(request, response, next, 'admin'), async (req: Request, res: Response) => {
  let result = await nextPicu(req.params.role);
  res.status(201).send(result);
});

/**
 * @swagger
 * /getPicuIds:
 *   get:
 *     tags:
 *       - PICU
 *     summary: Gets all PICU IDs, along with their roles
 *     security:
 *       - Bearer: []
 *     responses:
 *       '200':
 *         description: The next PICU ID.
 *       '400':
 *         description: Error occurred.
 */
app.get("/getPicuIds", (request: Request, response: Response, next:NextFunction) => authorise(request, response, next, 'field_engineer'), async (req: Request, res: Response) => {
  let result = await getAllIds(req.params.role);
  res.status(201).send(result);
});

/**
 * @swagger
 * /updatePicuPassword:
 *   put:
 *     tags:
 *       - Authorisation
 *     summary: Update the password for a given PICU ID.
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: body
 *         name: body
 *         description: PICU ID and the new password.
 *         schema:
 *           type: object
 *           required:
 *             - picu_id
 *             - newPassword
 *           properties:
 *             picu_id:
 *               type: string
 *               description: The ID of the PICU whose password needs updating.
 *             newPassword:
 *               type: string
 *               description: The new password.
 *     responses:
 *       201:
 *         description: Password updated successfully.
 *       400:
 *         description: An error occurred.
 */
app.put("/updatePicuPassword", (request: Request, response: Response, next:NextFunction) => authorise(request, response, next, 'field_engineer'), async (req: Request, res: Response) => {
  let result = await updatePicuPassword(req.body.picu_id, req.body.newPassword, req.params.role);
  let status:number = result.toString().includes("Error") ? 400 : 201;
  res.status(status).send(result);
});

/**
 * @swagger
 * /deletePicu:
 *   delete:
 *     tags:
 *       - PICU
 *     summary: Delete multiple PICUs based on provided PICU IDs.
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Array of PICU IDs to delete.
 *         schema:
 *           type: object
 *           required:
 *             - picu_ids
 *           properties:
 *             picu_ids:
 *               type: array
 *               description: The IDs of the PICUs to delete.
 *               items:
 *                 type: number
 *     responses:
 *       200:
 *         description: PICUs deleted successfully.
 *       400:
 *         description: An error occurred.
 */
app.delete("/deletePicu", (request: Request, response: Response, next:NextFunction) => authorise(request, response, next, 'admin'), async (req: Request, res: Response) => {
  let result = await deletePicus(req.body.picu_ids, req.params.role);
  let status:number = result.toString().includes("Error") ? 400 : 201;
  res.status(status).send(result);
});

/**
 * @swagger
 * /updatePicu:
 *   put:
 *     tags:
 *       - PICU
 *     summary: Update a PICU's details based on the provided data.
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: body
 *         name: body
 *         description: The data to update for the PICU.
 *         schema:
 *           type: object
 *           $ref: '#/definitions/Picu'
 *           required:
 *            - hospital_name
 *            - auditor
 *            - picu_role
 *            - picu_id
 *            - ward_name
 *     responses:
 *       201:
 *         description: PICU updated successfully.
 *       400:
 *         description: An error occurred.
 */
app.put("/updatePicu", (request: Request, response: Response, next:NextFunction) => authorise(request, response, next, 'admin'), async (req: Request, res: Response) => {
  let result = await editPicu(req.body, req.params.role);
  let status:number = result.toString().includes("Error") ? 400 : 201;
  res.status(status).send(result);
});

  /**
 * @swagger
 * /get-all-picu:
 *   get:
 *     tags:
 *       - PICU
 *     summary: Get all compliance data
 *     security:
 *       - Bearer: []
 *     responses:
 *       201:
 *         description: PICU data retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 allData:
 *                   type: array
 *                   items:
 *                     $ref: '#/definitions/Picu'
 *       400:
 *         description: An error occurred.
 */
app.get("/get-all-picu", (request: Request, response: Response, next:NextFunction) => authorise(request, response, next, 'admin'), async (req: Request, res: Response) => {
  let result:{allData:any[]}|string = await getPicuData(req.params.role);
  let status:number = result.toString().includes("Error") ? 400 : 201;
  res.status(status).send(result);
});

/**
 * @swagger
 * /verify-captcha:
 *   post:
 *     tags:
 *       - Authorisation
 *     summary: Verify the provided CAPTCHA token.
 *     parameters:
 *       - in: body
 *         name: body
 *         description: CAPTCHA token to verify.
 *         schema:
 *           type: object
 *           required:
 *             - token
 *           properties:
 *             token:
 *               type: string
 *               description: The CAPTCHA token to verify.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: CAPTCHA token verification result.
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               description: Result of the CAPTCHA token verification.
 *       400:
 *         description: An error occurred.
 */
app.post("/verify-captcha", async (request: Request, response: Response) => {
  response.send({success: await verifyCaptcha(request.body.token)});
});

/**
 * @swagger
 * /update-compliance:
 *   put:
 *     tags:
 *       - Compliance
 *     summary: Update a compliance entry based on the provided data.
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: body
 *         name: complianceData
 *         description: The data to update for the compliance entry.
 *         schema:
 *           type: object
 *           $ref: '#/definitions/ComplianceData'
 *     responses:
 *       201:
 *         description: Compliance entry updated successfully.
 *       400:
 *         description: An error occurred.
 */
app.put("/update-compliance", (request: Request, response: Response, next:NextFunction) => authorise(request, response, next, 'admin'), async (req: Request, res: Response) => {
  let result:string = await editCompliance(req.body, req.params.role);
  let status:number = result.toString().includes("Error") ? 400 : 201;

  res.status(status).send(result);
});

/**
 * @swagger
 * /delete-compliance:
 *   delete:
 *     tags:
 *       - Compliance
 *     summary: Delete multiple compliance records based on provided IDs.
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Array of compliance record IDs to delete.
 *         schema:
 *           type: object
 *           required:
 *             - comp_ids
 *           properties:
 *             comp_ids:
 *               type: array
 *               description: The IDs of the compliance records to delete.
 *               items:
 *                 type: number
 *     responses:
 *       200:
 *         description: Compliance records deleted successfully.
 *       400:
 *         description: An error occurred.
 */
app.delete("/delete-compliance", (request: Request, response: Response, next:NextFunction) => authorise(request, response, next, 'admin'), async (req: Request, res: Response, next:NextFunction) => {
  let result:string = await deleteCompRecords(req.body.comp_ids, req.params.role);
  let status:number = result.toString().includes("Error") ? 400 : 201;
  res.status(status).send(result);
});

/**
 * @swagger
 * /get-all-compliance:
 *   get:
 *     tags:
 *       - Compliance
 *     summary: Get all compliance data
 *     security:
 *       - Bearer: []
 *     responses:
 *       201:
 *         description: Compliance data retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 allData:
 *                   type: array
 *                   items:
 *                     $ref: '#/definitions/ComplianceData'
 *       400:
 *         description: An error occurred.
 */
app.get("/get-all-compliance", (request: Request, response: Response, next:NextFunction) => authorise(request, response, next, 'admin'), async (req: Request, res: Response) => {
  let result:{allData:any[]}|string = await getComplianceData(req.params.role);
  let status:number = result.toString().includes("Error") ? 400 : 201;
  res.status(status).send(result);
});

  /**
 * @swagger
 * /get-all-logs:
 *   get:
 *     tags:
 *       - Log
 *     summary: Get all log data
 *     security:
 *       - Bearer: []
 *     responses:
 *       201:
 *         description: Log data retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 allData:
 *                   type: array
 *       400:
 *         description: An error occurred.
 */
  app.get("/get-all-logs", (request: Request, response: Response, next:NextFunction) => authorise(request, response, next, 'admin'), async (req: Request, res: Response) => {
    let result:{allData:any[]}|string = await getLogData(req.params.role);
    let status:number = result.toString().includes("Error") ? 400 : 201;
    res.status(status).send(result);
  });

// Used to activate the endpoints through HTTP
app.listen(port,()=> {
  console.log(`listen port ${port}`);
  console.log(`Go to http://${baseIP}:${port}/swagger-docs for documentation`);
});

// Used to activate the endpoints through HTTPS
// https.createServer(options, app)
// .listen(port, () => {
//   console.log(`listen port ${port}`);
//   console.log(`Go to https://${baseIP}:${port}/swagger-docs for documentation`);
// });
