
import mongoose from "mongoose";

let Schema= mongoose.Schema;

let UserSchema= new Schema({
  username: String,
  gender : {type: String, default: "male"},
  phone: {type: Number, default: null},
  address: {type: String, default: null},
  avatar: {type: String, default: "avatar-default.jpg" },
  role: {type: String, default: "user"},
  local: {
    email: {type: String, trim: true},
    password: String,
    isActived: {type: Boolean, default: false },
    verifyTyoken: String
  },
  facebook: {
    uid: String,
    token: String,
    email: {type: String, trim: false}
  },
  google: {
    uid: String,
    token: String,
    email: {type: String, trim: false}
  },
  createdAt: {type: Number, default: Date.now},
  updatedAt: {type: Number, default: Date.null},
  deletedAt: {type: Number, default: Date.null}
});

module.exports = mongoose.model("user", UserSchema);
