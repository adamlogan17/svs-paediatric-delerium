import express, { NextFunction, Request, Response, response } from 'express';
import morgan from "morgan";
import bp from 'body-parser';
import https from 'https';
import fs from 'fs';
import { config } from 'dotenv';


import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { deleteData, getAll, getPicuData, insertData, updateData } from './crud';
import { authenticate, authorise, updatePicuPassword, verifyCaptcha } from './login';
import { allPicuCompliance, singlePicuCompliance } from './auditCharts';
import { addPicu, deletePicus, editPicu, getAllIds, nextPicu } from './picuDbManagement';

// initialise process.env
config();


// Express Initialize
const app = express();
const port: number = 8000;

interface APICallDetail {
  date: string;
  time: string;
  method: string;
  url: string;
  status: number;
  userIP: string;
  userAgent: string;
  userRole: string;
  username: string;
}


// apps certs for https
const options = {
  key: fs.readFileSync("server.key"),
  cert: fs.readFileSync("server.cert"),
};

const apiCallDetails: APICallDetail[] = [];

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
          url: `https://localhost:${port}`
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
app.use((req:Request, res:Response, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
});

app.use((req:Request, res:Response, next) =>{
  const now = new Date();
  const apiCallDetail: APICallDetail = {
    date: now.toISOString().split('T')[0], // Separate date
    time: now.toISOString().split('T')[1].split('.')[0], // Separate time
    method: req.method,
    url: req.originalUrl,
    status: res.statusCode,
    userIP: req.ip,
    userAgent: req.headers['user-agent'] || '',
    username: req.params.username,
    userRole: req.params.role,
  };

  // Add the API call detail to the array
  apiCallDetails.push(apiCallDetail);
  insertData("audit", "api_log", apiCallDetail);

  // Continue with the request handling
  next();
});

app.use((req:Request, res:Response, next) =>{
  const now = new Date();
  const apiCallDetail: APICallDetail = {
    date: now.toISOString().split('T')[0], // Separate date
    time: now.toISOString().split('T')[1].split('.')[0], // Separate time
    method: req.method,
    url: req.originalUrl,
    status: res.statusCode,
    userIP: req.ip,
    userAgent: req.headers['user-agent'] || '',
    username: req.params.username,
    userRole: req.params.role,
  };

  // Add the API call detail to the array
  apiCallDetails.push(apiCallDetail);
  insertData("audit", "api_log", apiCallDetail);

  // Continue with the request handling
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
app.get("/test/:val", (req: Request,res: Response)=>{
    res.status(200).send({
        hello:"world",
        val: req.params.val
    });
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
app.post("/login", authenticate);

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
 * /{database}/getpicudata/{table}:
 *  get:
 *    tags:
 *      - CRUD
 *    summary: Gets specific picu data from table
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
app.get("/:database/getpicudata/:table", async (req: Request,res: Response) => {
  let result:{allData:any[]}|string = await getPicuData(req.params.database, req.params.table, req.params.role === undefined ? "postgres" : `${req.params.role}_role`, req.params.role === undefined ? "postgrespw": "password", req.params.picuID);
  let status:number = typeof result === 'string' ? 400 : 200;
  res.status(status).send(result);
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
 * /test-auth:
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
app.get("/test-auth", (request: Request, response: Response, next:NextFunction) => authorise(request, response, next), (request:any, response) => {
  response.json({ message: "You are authorized to access me" , user: request.params.username, role: request.params.role});
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
app.get("/test-auth/admin", (request: Request, response: Response, next:NextFunction) => authorise(request, response, next, "admin"), (request:any, response) => {
  response.json({ message: "You are authorized to access me" , user: request.params.username, role: request.params.role});
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
app.get("/test-auth/field-engineer", (request: Request, response: Response, next:NextFunction) => authorise(request, response, next, "field_engineer"), (request:any, response) => {
  response.json({ message: "You are authorized to access me" , user: request.params.username, role: request.params.role});
});

/**
 * Retrieves the compliance data of the site requested
 * TODO If the user has a picu role make sure that their ID matches that of the one they are requesting
 * @author Adam Logan
 */
app.get("/chartData/singleSite/:siteId", (request: Request, response: Response, next:NextFunction) => authorise(request, response, next), singlePicuCompliance);

/**
 * Retrieves the anonymised compliance data of all the sites
 */
app.get("/chartData/allSites", allPicuCompliance);

/**
 * Inserts compliance data
 * TODO Create another endpoint to allow an admin (and possible a field engineer) to insert data for any picu
 * @author Adam Logan
 */
// app.post("/compData", , insertCompData);

/**
 * @swagger
 * /addPicu:
 *   post:
 *     tags:
 *       - Picu
 *     name: Add Picu
 *     summary: Adds a new Picu to the database
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
 *         description: Picu successfully added.
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
 *       - Picu
 *     name: Add Picu
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
 *       - Picu
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
 *       - Picu
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
 *       - Picu
 *     summary: Update a PICU's details based on the provided data.
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: body
 *         name: body
 *         description: The data to update for the PICU.
 *         schema:
 *           type: object
 *           required:
 *            - hospital_name
 *            - auditor
 *            - picu_role
 *            - picu_id
 *            - ward_name
 *           properties:
 *             data:
 *               $ref: '#/definitions/Picu'
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
app.post("/verify-captcha", async (request: Request, response: Response,) => {
  response.send({success: await verifyCaptcha(request.body.token)});
});

/* function saveApiCallDetailsToDatabase() {
  console.log('Saved API Call Details:');
  apiCallDetails.forEach((apiCallDetail, index) => {
    console.log(`#${index + 1}:`);
    console.log(`Date: ${apiCallDetail.date}`);
    console.log(`Time: ${apiCallDetail.time}`);
    console.log(`Method: ${apiCallDetail.method}`);
    console.log(`URL: ${apiCallDetail.url}`);
    console.log(`Status: ${apiCallDetail.status}`);
    console.log(`UserIP: ${apiCallDetail.userIP}`);
    console.log(`UserAgent: ${apiCallDetail.userAgent}`);
    console.log(`UserRole: ${apiCallDetail.userRole}`);
    console.log(`Username: ${apiCallDetail.username}`);
    console.log('-------------------');
  });

  // In a real application, you would save this data to the database here
  // Your database saving logic goes here

  // Clear the apiCallDetails array after printing
  apiCallDetails.length = 0;
}

setInterval(() => {
  saveApiCallDetailsToDatabase();
}, 5000); */

// Used to activate the endpoints through HTTP
app.listen(port,()=> {
  console.log(`listen port ${port}`);
  console.log(`Go to http://localhost:${port}/swagger-docs for documentation`);
});

// Used to activate the endpoints through HTTPS
// https.createServer(options, app)
// .listen(port, () => {
//   console.log(`listen port ${port}`);
//   console.log(`Go to https://localhost:${port}/swagger-docs for documentation`);
// });

