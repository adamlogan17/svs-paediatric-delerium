import express from 'express';

// Express Initialize
const app = express();
const port = 8000;

let x: number = 1;
x++;

//create api
app.get('/:val', (req: any,res: any)=>{
    res.send({
        hello:'world2',
        value: x,
        out: req.params.val
    });
});

app.listen(port,()=> {
    console.log('listen port 8000');
})