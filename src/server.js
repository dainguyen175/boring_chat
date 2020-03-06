import express from "express";
import ConnectDB from "./config/connectDB";
import configViewEngine from "./config/viewEngine";
import initRoutes from "./routes/web";

// init app 
let app = express();

//connect to mongodb
ConnectDB();

// config view engine 
configViewEngine(app);

initRoutes(app);

app.listen(process.env.APP_PORT, process.env.APP_HOST, () =>{
  console.log(`Hello, i'm running at ${process.env.APP_HOST}:${process.env.APP_PORT}/`);
});

