import express, { Request, Response, response } from 'express';
import morgan from "morgan";
import bp from 'body-parser';
import { deleteData, getAll, insertData, updateData } from './crud';
import { adminAuthorise, authenticate, authorise, fieldAuthorise, retrieveUserDetails } from './login';
import { insertCompData } from './complianceScores';

// import cors from 'cors';

// Express Initialize
const app = express();
const port: number = 8000;

// logs when an API is called from the app
app.use(morgan("tiny"));
// allows messages to be read from the body of a request
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }));

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

app.get("/test-auth/admin", authorise, adminAuthorise, (request:any, response) => {
    response.json({ message: "You are authorized to access me" , user: request.params.user, role: request.params.role});
});

app.get("/test-auth/field-engineer", authorise, fieldAuthorise, (request:any, response) => {
    response.json({ message: "You are authorized to access me" , user: request.params.user, role: request.params.role});
});

app.get("/test-auth/:database/getall/:table", authorise, getAll);

app.post("/test-auth/:database/insertdata", authorise, insertData);

app.put("/test-auth/:database/updatedata", authorise, updateData);

app.delete("/test-auth/:database/deletedata/:table/:predicate", authorise, deleteData);

app.post("/compData", authorise, insertCompData);


/**
 * Retrieves the user's userId and role from the token provided
 * @author Adam Logan
 */
app.get("/auth/:token", retrieveUserDetails);

app.listen(port,()=> {
    console.log(`listen port ${port}`);
    console.log(`Go to http://localhost:${port}/`);
});
