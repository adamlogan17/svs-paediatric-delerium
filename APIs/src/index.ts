import express, { Request, Response } from 'express';
import morgan from "morgan";
import bp from 'body-parser';
import { deleteData, getAll, insertData, updateData } from './crud';
import { adminAuthorise, authenticate, authorise, fieldAuthorise, retrieveUserDetails } from './login';
import { allPicuCompliance, singlePicuCompliance } from './auditCharts';
import { insertCompData } from './complianceScores';

// Express Initialize
const app = express();
const port: number = 8000;

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

/**
 * Simple API that returns a value
 * @author Adam Logan
 */
app.get("/test/:val", (req: Request,res: Response)=>{
    res.send({
        hello:"world",
        val: req.params.val
    });
});

/**
 * Gets all data from a database
 * @author Adam Logan
 */
app.get("/:database/getall/:table", getAll);

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
 * Will log a user into the system
 * @author Adam Logan
 */
app.post("/login", authenticate);

/**
 * Tests the 'authorise' function
 * @author Adam Logan
 */
app.get("/test-auth", authorise, (request:any, response) => {
    response.json({ message: "You are authorized to access me" , user: request.params.user, role: request.params.role});
});

/**
 * Test endpoint to check if a user is an admin
 * @author Adam Logan
 */
app.get("/test-auth/admin", authorise, adminAuthorise, (request:any, response) => {
    response.json("You are authorized to access me!");
});

/**
 * Test endpoint to check if a user is a field engineer
 * @author Adam Logan
 */
app.get("/test-auth/field-engineer", authorise, fieldAuthorise, (request:any, response) => {
    response.json("You are authorized to access me!");
});

/**
 * Tests RBAC for retrieving data from database
 * @author Adam Logan
 */
app.get("/test-auth/:database/getall/:table", authorise, getAll);

/**
 * Tests RBAC for inserting data to the database
 * @author Adam Logan
 */
app.post("/test-auth/:database/insertdata", authorise, insertData);

/**
 * Tests RBAC for updating data from database
 * @author Adam Logan
 */
app.put("/test-auth/:database/updatedata", authorise, updateData);

/**
 * Tests RBAC for deleting data from database
 * @author Adam Logan
 */
app.delete("/test-auth/:database/deletedata/:table/:predicate", authorise, deleteData);


/**
 * Retrieves the user's userId and role from the token provided
 * @author Adam Logan
 */
app.get("/auth/:token", retrieveUserDetails);

/**
 * Retrieves the compliance data of the site requested
 * TODO If the user has a picu role make sure that their ID matches that of the one they are requesting
 * @author Adam Logan
 */
app.get("/chartData/singleSite/:siteId", singlePicuCompliance);

/**
 * Retrieves the anonymised compliance data of all the sites
 */
app.get("/chartData/allSites", allPicuCompliance);

/**
 * Inserts compliance data
 * TODO Create another endpoint to allow an admin (and possible a field engineer) to insert data for any picu
 * @author Adam Logan
 */
app.post("/compData", authorise, insertCompData);

app.listen(port,()=> {
    console.log(`listen port ${port}`);
    console.log(`Go to http://localhost:${port}/`);
});
