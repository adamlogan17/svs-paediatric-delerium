import express from 'express';

// Express Initialize
const app = express();
const port: number = 80;

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
})