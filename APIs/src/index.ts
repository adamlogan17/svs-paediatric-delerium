import express, { NextFunction, Request, Response, response } from 'express';
import morgan from "morgan";
import bp from 'body-parser';
import https from 'https';
import fs from 'fs';

import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { deleteData, getAll, insertData, updateData } from './crud';
import { adminAuthorise, authenticate, authorise, fieldAuthorise, retrieveUserDetails } from './login';
import { allPicuCompliance, singlePicuCompliance } from './auditCharts';
import { insertCompData } from './complianceScores';
import { addPicu } from './picuDbManagement';

// Express Initialize
const app = express();
const port: number = 8000;

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
          url: "https://localhost:8000"
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

// Routes
/**
 * @swagger
 * /test/{val}:
 *  get:
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
 *       - Users
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
 *           type: object
 *           properties:
 *             username:
 *               type: integer
 *             password:
 *               type: string
 *           required:
 *             - username
 *             - password
 *     responses:
 *       200:
 *         description: Successful operation
 *         schema:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *       401:
 *         description: Unauthorized - Invalid username or password
 *       500:
 *         description: Internal Server Error
 */
app.post("/login", authenticate);

/**
 * @swagger
 * /{database}/getall/{table}:
 *  get:
 *    summary: Gets all data from table
 *    description: Returns all the rows for the selected table, within the selected database
 *    parameters:
 *      - name: database
 *        in: path
 *        description: The name of the selected database
 *        schema:
 *          type: "string"
 *        required: true
 *      - name: table
 *        in: path
 *        description: The name of the selected database
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
 * Inserts data to a database
 * @author Adam Logan
 */
app.post("/:database/insertdata", insertData);

/**
 * Updates data in the database
 * @author Adam Logan
 */
app.put("/:database/updatedata", updateData);

/**
 * Deletes the data in the database
 * @author Adam Logan
 */
app.delete("/:database/deletedata/:table/:predicate", deleteData);

/**
 * @swagger
 * /test-auth:
 *   get:
 *     tags:
 *       - Authorization
 *     description: Endpoint that requires authorization.
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
// app.get("/test-auth", authorise, (request:any, response) => {
//     response.json({ message: "You are authorized to access me" , user: request.params.user, role: request.params.role});
// });

// /**
//  * Test endpoint to check if a user is an admin
//  * @author Adam Logan
//  */
// app.get("/test-auth/admin", authorise, adminAuthorise, (request:any, response) => {
//     response.json("You are authorized to access me!");
// });

// /**
//  * Test endpoint to check if a user is a field engineer
//  * @author Adam Logan
//  */
// app.get("/test-auth/field-engineer", authorise, fieldAuthorise, (request:any, response) => {
//     response.json("You are authorized to access me!");
// });

// /**
//  * Tests RBAC for retrieving data from database
//  * @author Adam Logan
//  */
// // app.get("/test-auth/:database/getall/:table", authorise, getAll);

// /**
//  * Tests RBAC for inserting data to the database
//  * @author Adam Logan
//  */
// app.post("/test-auth/:database/insertdata", authorise, insertData);

// /**
//  * Tests RBAC for updating data from database
//  * @author Adam Logan
//  */
// app.put("/test-auth/:database/updatedata", authorise, updateData);

// /**
//  * Tests RBAC for deleting data from database
//  * @author Adam Logan
//  */
// app.delete("/test-auth/:database/deletedata/:table/:predicate", authorise, deleteData);


// /**
//  * Retrieves the user's userId and role from the token provided
//  * @author Adam Logan
//  */
// app.get("/auth/:token", retrieveUserDetails);

// /**
//  * Retrieves the compliance data of the site requested
//  * TODO If the user has a picu role make sure that their ID matches that of the one they are requesting
//  * @author Adam Logan
//  */
// app.get("/chartData/singleSite/:siteId", authorise, singlePicuCompliance);

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

// app.post("/addPicu", authorise, adminAuthorise, addPicu);
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
 * definitions:
 *   Picu:
 *     properties:
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
 */

app.post("/addPicu", (request: Request, response: Response, next:NextFunction) => authorise(request, response, next), async (req: Request, res: Response) => {
  console.log("body", req.body);
  let x = {
    hospital_name:"a", 
    auditor:"b", 
    picu_role:'picu',
    password:"c",
    ward_name:"d",
  }
  let result = await addPicu(req.body);
  let status:number = typeof result === 'string' ? 400 : 200;
  res.status(status).send(result);
});

// Used to activate the endpoints through HTTP
// app.listen(port,()=> {
//   console.log(`listen port ${port}`);
//   console.log(`Go to http://localhost:${port}/`);
// });

// Used to activate the endpoints through HTTPS
https.createServer(options, app)
.listen(port, () => {
  console.log(`listen port ${port}`);
  console.log(`Go to https://localhost:${port}/swagger-docs for documentation`);
});
