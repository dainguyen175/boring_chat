import contactModel from "./../model/contactModel";
import userModel from "./../model/userModel";
import _ from "lodash"

let findUsersContact = (currentUserId, keyword) =>{
  return new Promise(async (resolve, reject)=>{
    let deprecatedUserIds = [];
    let contactsByUser =  await contactModel.findAllByUser(currentUserId);
    contactsByUser.forEach( (contact)=>{
      deprecatedUserIds.push(contact.userId);
      deprecatedUserIds.push(contact.contactId)
    });

    deprecatedUserIds = _.unionBy(deprecatedUserIds);
    let users = await userModel.findAllForAddContact(deprecatedUserIds, keyword);
    resolve(users);
  });
}

module.exports = {
  findUsersContact: findUsersContact
};
