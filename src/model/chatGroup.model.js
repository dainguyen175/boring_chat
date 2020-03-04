
import mongoose from "mongoose";

let Schema= mongoose.Schema;

let ChatGroupSchema= new Schema({
  name: String,
  userAmount: {type: Number, min: 3, max: 99},
  messageAmount: {type: Number, default: 0},
  userId: String,
  members: [
    {userId: String}
  ],
  createdAt: {type: Number, default: Date.now},
  updatedAt: {type: Number, default: Date.null},
  deletedAt: {type: Number, default: Date.null}
});

module.exports = mongoose.model("chatgroup", ChatGroupSchema);
