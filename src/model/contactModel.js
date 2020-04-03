import mongoose from "mongoose";

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
   * Remove request contact sent
   * @param {string} userId 
   * @param {string} contactId 
   */
  removeRequestContactSent (userId, contactId){
    return this.remove({
      $and: [
        {"userId": userId},
        {"contactId" : contactId},
        {"status" :false}
      ]
    }).exec()
  },

  /**
   * Remove request contact received
   * @param {string} userId 
   * @param {string} contactId 
   */
  removeRequestContactReceived (userId, contactId){
    return this.remove({
      $and: [
        {"userId": contactId},
        {"contactId" : userId},
        {"status": false}
      ]
    }).exec()
  },
  
  /**
   * Approve contact received
   * @param {string: of currentUser} userId 
   * @param {string} contactId 
   */
  approveRequestContactReceived (userId, contactId){
    return this.update({
      $and: [
        {"userId": contactId},
        {"contactId" : userId},
        {"status": false}
      ]
    }, {"status" : true }).exec()
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

  /**
   * Read more contact by user_id, skip, limit
   * @param {string} userId 
   * @param {number} skip
   * @param {number} limit 
   */
  readMoreContacts ( userId, skip, limit) {
    return this.find({
      $and: [
        {$or: [
          {"userId": userId},
          {"contactId": userId}
        ]},
        {"status": true }
      ]
    }).sort({"createdAt" :-1}).skip(skip).limit(limit).exec();
  },

  /**
   * Read more contact sent by user_id, skip, limit
   * @param {string} userId 
   * @param {number} skip
   * @param {number} limit 
   */
  readMoreContactsSent( userId, skip, limit) {
    return this.find({
      $and: [
        {"userId": userId },
        {"status": false }
      ]
    }).sort({"createdAt" :-1}).skip(skip).limit(limit).exec();
  },

  /**
   * Read more contacts received ,10 item
   * @param {string} userId 
   * @param {number} skip 
   * @param {number} limit 
   */
  readMoreContactsReceived (userId, skip , limit) {
    return this.find({
      $and: [
        {"contactId": userId },
        {"status": false }
      ]
    }).sort({"createdAt" :-1}).skip(skip).limit(limit).exec();
  },
}; 

module.exports = mongoose.model("contact", ContactSchema);
 
