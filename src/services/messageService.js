import contactModel from "./../model/contactModel";
import userModel from "./../model/userModel";
import chatGroupModel from "./../model/chatGroupModel";
import _ from "lodash";

const LIMIT_CONVERSATIONS_TAKEN= 15;

/**
 * Get all conversations
 * @param {string} currentUserId 
 */
let getAllConversationItems = (currentUserId) => {
  return new Promise( async( resolve, reject) => {
    try {
      let contacts = await contactModel.getContacts(currentUserId, LIMIT_CONVERSATIONS_TAKEN);
      
      let userConversationsPromise = contacts.map(async (contact) => {
        if (contact.contactId == currentUserId){
          let getUserContact = await userModel.getNormalUserDataById(contact.userId);
          // getUserContact = getUserContact.toObject();
          getUserContact.createdAt = contact.createdAt;
          return getUserContact;
        } else {
          let getUserContact = await userModel.getNormalUserDataById(contact.contactId);
          // getUserContact = getUserContact.toObject();
          getUserContact.createdAt = contact.createdAt;
          return getUserContact;
        }
      });
      let userConversations = await Promise.all(userConversationsPromise);
      let groupConversations = await chatGroupModel.getChatGroups(currentUserId, LIMIT_CONVERSATIONS_TAKEN);
      
      let allConversations = userConversations.concat(groupConversations);
      allConversations = _.sortBy (allConversations , (item) => {
        return -item.createdAt;
      });
      
      resolve ({
        allConversations: allConversations,
        groupConversations: groupConversations,
        userConversations: userConversations
      });
    } catch (error) {
      reject (error)
    }
  });
};

module.exports ={
  getAllConversationItems: getAllConversationItems
}
