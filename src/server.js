import express from "express";
import ConnectDB from "./config/connectDB";
import configViewEngine from "./config/viewEngine";
import initRoutes from "./routes/web";
import bodyParser from "body-parser";
import connectFlash from "connect-flash";
import configSession from "./config/session";
import passport from "passport";

import pem from "pem";
import https from "https";

pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
  if (err) {
    throw err;
  }

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
  
  // Config passport js
  app.use(passport.initialize());
  app.use(passport.session());
  
  //Init all routes
  initRoutes(app);


  https.createServer({ key: keys.serviceKey, cert: keys.certificate }, app).listen(process.env.APP_PORT, process.env.APP_HOST, () =>{
    console.log(`Hello, i'm running at ${process.env.APP_HOST}:${process.env.APP_PORT}/`);
  });
});

// // init app 
// let app = express();

// //connect to mongodb
// ConnectDB();

// // Config session 
// configSession(app);

// // config view engine 
// configViewEngine(app);

// //Enable post data for request
// app.use(bodyParser.urlencoded({extended: true})); 

// //Enable flash msg
// app.use(connectFlash());

// // Config passport js
// app.use(passport.initialize());
// app.use(passport.session());

// //Init all routes
// initRoutes(app);

// app.listen(process.env.APP_PORT, process.env.APP_HOST, () =>{
//   console.log(`Hello, i'm running at ${process.env.APP_HOST}:${process.env.APP_PORT}/`);
// });
