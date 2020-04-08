import contactModel from "./../model/contactModel";
import userModel from "./../model/userModel";
import chatGroupModel from "./../model/chatGroupModel";
import messageModel from "./../model/messageModel";
import _ from "lodash";

const LIMIT_CONVERSATIONS_TAKEN= 15;
const LIMIT_MESSAGES_TAKEN= 30;
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
          getUserContact.updatedAt = contact.updatedAt;
          return getUserContact;
        } else {
          let getUserContact = await userModel.getNormalUserDataById(contact.contactId);
          // getUserContact = getUserContact.toObject();
          getUserContact.updatedAt = contact.updatedAt;
          return getUserContact;
        }
      });
      let userConversations = await Promise.all(userConversationsPromise);
      let groupConversations = await chatGroupModel.getChatGroups(currentUserId, LIMIT_CONVERSATIONS_TAKEN);
      
      let allConversations = userConversations.concat(groupConversations);
      allConversations = _.sortBy (allConversations , (item) => {
        return -item.updatedAt;
      });

      // get messages to apply in screen chat
      let allConversationWithMessagePromise =  allConversations.map( async (conversation) => {
        let getMessages = await messageModel.model.getMessages(currentUserId, conversation._id,LIMIT_MESSAGES_TAKEN);

        conversation = conversation.toObject();
        conversation.messages= getMessages;

        return conversation;
      });
      let allConversationWithMessages = await Promise.all(allConversationWithMessagePromise);

      // sort by updatedAt desending
      allConversationWithMessages = _.sortBy(allConversationWithMessages, (item)=> {
        return -item.updatedAt;
      });

      resolve ({
        allConversationWithMessages: allConversationWithMessages,
      });
    } catch (error) {
      reject (error)
    }
  });
};

module.exports ={
  getAllConversationItems: getAllConversationItems
}
