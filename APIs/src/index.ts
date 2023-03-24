import express, { Request, Response } from 'express';
import morgan from "morgan";
import bp from 'body-parser';
import {getAll, insertData} from './crud';

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
app.get("/database/getall/:table", getAll);

app.post("/database/insertdata", insertData)

app.listen(port,()=> {
    console.log(`listen port ${port}`);
    console.log(`Go to http://localhost:${port}/`);
});