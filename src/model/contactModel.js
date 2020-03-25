
import mongoose from "mongoose";
import { contact } from "../services";

let Schema= mongoose.Schema;

let ContactSchema= new Schema({
  userId: String,
  contactId: String,
  status: {type: Boolean, default: false},
  createdAt: {type: Number, default: Date.now},
  updatedAt: {type: Number, default: null},
  deletedAt: {type: Number, default: null}
});

ContactSchema.statics = {
  createNew(item) {
    return this.create(item);
  },

  /**
   * Find all items related with users
   * @param {String} userId 
   */
  findAllByUser (userId) {
    return this.find({
      $or: [
        {"userId": userId},
        {"contactId": userId}
      ]
    }).exec();
  },

  /**
   * Check exists of 2 users
   * @param {string} userId 
   * @param {string} contactId 
   */
  checkExists( userId, contactId){
    return this.findOne({
      $or : [
        {$and: [
          {"userId" : userId}, 
          {"contactId": contactId}
        ]},
        {$and: [
          {"userId": contactId},
          {"contactId" : userId}
        ]}
      ]
    }).exec();
  },

  /**
   * Remove request
   * @param {string} userId 
   * @param {string} contactId 
   */
  removeRequestContact (userId, contactId){
    return this.remove({
      $and: [
        {"userId": userId},
        {"contactId" : contactId}
      ]
    }).exec()
  },

  /**
   * Get contact by userid and limit
   * @param {string} userId 
   * @param {number} limt 
   */
  getContacts(userId, limit){
    return this.find({
      $and: [
        {$or: [
          {"userId": userId},
          {"contactId": userId}
        ]},
        {"status": true }
      ]
    }).sort({"createdAt" :-1}).limit(limit).exec();
  },

  /**
   * Get contact sent by userid and limit
   * @param {string} userId 
   * @param {number} limt 
   */
  getContactsSent(userId, limit){
    return this.find({
      $and: [
        {"userId": userId },
        {"status": false }
      ]
    }).sort({"createdAt" :-1}).limit(limit).exec();
  },
  /**
   * Get contact received by userid and limit
   * @param {string} userId 
   * @param {number} limt 
   */
  getContactsReceived(userId, limit){
    return this.find({
      $and: [
        {"contactId": userId },
        {"status": false }
      ]
    }).sort({"createdAt" :-1}).limit(limit).exec();
  },

  /**
   * Count all contact by userid and limit
   * @param {string} userId 
   */
  countAllContacts(userId){
    return this.count({
      $and: [
        {$or: [
          {"userId": userId},
          {"contactId": userId}
        ]},
        {"status": true }
      ]
    }).exec();  
  },

  /**
   * Count all contact sent by userid and limit
   * @param {string} userId 
   */
  countAllContactsSent(userId){
    return this.count({
      $and: [
        {"userId": userId },
        {"status": false }
      ]
    }).exec();
  },
  /**
   * Count all contact received by userid and limit
   * @param {string} userId 
   */
  countAllContactsReceived(userId){
    return this.count({
      $and: [
        {"contactId": userId },
        {"status": false }
      ]
    }).exec();
  },

}; 
module.exports = mongoose.model("contact", ContactSchema);
