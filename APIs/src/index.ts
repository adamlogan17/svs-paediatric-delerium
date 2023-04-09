import express, { Request, Response } from 'express';
import morgan from "morgan";
import bp from 'body-parser';
import {deleteData, getAll, insertData, updateData} from './crud';
import { loginTest } from './login';

// Express Initialize
const app = express();
const port: number = 8000;

// logs when an API is called from the app
app.use(morgan("tiny"));
// allows messages to be read from the body of a request
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))

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

app.get("/login", loginTest);

app.listen(port,()=> {
    console.log(`listen port ${port}`);
    console.log(`Go to http://localhost:${port}/`);
});