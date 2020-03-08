import express from "express";
import ConnectDB from "./config/connectDB";
import configViewEngine from "./config/viewEngine";
import initRoutes from "./routes/web";
import bodyParser from "body-parser";
import connectFlash from "connect-flash";
import configSession from "./config/session";

// init app 
let app = express();

//connect to mongodb
ConnectDB();

// Config session 
configSession(app);

// config view engine 
configViewEngine(app);

//Enable post data for request
app.use(bodyParser.urlencoded({extended: true})); 

//Enable flash msg
app.use(connectFlash());

//Init all routes
initRoutes(app);

app.listen(process.env.APP_PORT, process.env.APP_HOST, () =>{
  console.log(`Hello, i'm running at ${process.env.APP_HOST}:${process.env.APP_PORT}/`);
});

