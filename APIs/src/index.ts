import express from 'express';
import morgan from "morgan";
import {getAll} from './test';

// Express Initialize
const app = express();
const port: number = 8000;

// logs when the app 
app.use(morgan("tiny"));

/**
 * Simple API that simply returns a value
 */
app.get("/test/:val", (req: any,res: any)=>{
    res.send({
        hello:"world",
        val: req.params.val
    });
});

/**
 * Gets all data from a database
 */
app.get("/getall/:table", getAll);

app.listen(port,()=> {
    console.log(`listen port ${port}`);
    console.log(`Go to http://localhost:${port}/`);
});