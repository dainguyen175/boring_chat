import express from "express";
import ConnectDB from "./config/connectDB";
import ContactModel from "./model/contact.model";

let app = express();

//connect to mongodb
ConnectDB();

app.get("/test-database", async (req, res) => {
    try {
      let item= {
        userId: "Dai175",
        contactId: "175",
      } 
      let contact= await ContactModel.createNew(item);
      res.send(contact);
    } catch (error) {
      console.log(error)
    }
});

app.listen(process.env.APP_HOST, process.env.APP_PORT, () =>{
  console.log(`Hello Dai,i'm running at ${process.env.APP_HOST}:${process.env.APP_PORT}/`);
});

