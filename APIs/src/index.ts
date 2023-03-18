import express from 'express';
import morgan from "morgan";

// Express Initialize
const app = express();
const port: number = 8000;

// logs when the app 
app.use(morgan("tiny"));

// create api
app.get("/:val", (req: any,res: any)=>{
    res.send({
        hello:"world",
        val: req.params.val
    });
});

app.listen(port,()=> {
    console.log(`listen port ${port}`);
    console.log(`Go to http://localhost:${port}/`);
});