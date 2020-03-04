
import mongoose from "mongoose";

let Schema= mongoose.Schema;

let MessageSchema= new Schema({
  sender: {
    id: String,
    username: String,
    avatar: String
  },
  receiver:{
    id: String,
    username: String,
    avatar: String
  },
  text: String,
  file: {data: Buffer, contextType: String, fileName: String},
  createdAt: {type: Number, default: Date.now},
  updatedAt: {type: Number, default: Date.null},
  deletedAt: {type: Number, default: Date.null}
});

module.exports = mongoose.model("message", MessageSchema);
