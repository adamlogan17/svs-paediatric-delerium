import express from 'express';
import morgan from "morgan";
const db = require('./test')


// Express Initialize
const app = express();
const port: number = 8000;

// logs when the app 
app.use(morgan("tiny"));



app.get("/database", db.getUsers);

app.listen(port,()=> {
    console.log(`listen port ${port}`);
    console.log(`Go to http://localhost:${port}/`);
});