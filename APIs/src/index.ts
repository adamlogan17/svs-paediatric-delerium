import express, { Request, Response } from 'express';
import morgan from "morgan";
import {getAll} from './test';

// Express Initialize
const app = express();
const port: number = 8000;

// logs when an API is called from the app
app.use(morgan("tiny"));

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
app.get("/getall/:table", getAll);

app.listen(port,()=> {
    console.log(`listen port ${port}`);
    console.log(`Go to http://localhost:${port}/`);
});