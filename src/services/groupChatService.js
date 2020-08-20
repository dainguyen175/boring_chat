import chatGroupModel from "./../model/chatGroupModel";
import notificationModel from "./../model/notificationModel";
import _ from "lodash";

let addNewGroup = (currentUserId, arrayMembersId, groupChatName) => {
  return new Promise(async (resolve, reject)=>{
    try {
      // add current user id to array member
      arrayMembersId.unshift({userId: `${currentUserId}`});

      arrayMembersId = _.uniqBy(arrayMembersId, "userId");

      //create new group
      let newGroupChatItem = {
        name: groupChatName,
        userAmount: arrayMembersId.length,
        userId: `${currentUserId}`,
        members: arrayMembersId
      };

      let newGroupChat= await chatGroupModel.createNew(newGroupChatItem);
 
      // //create notification
      // let notificationItem = {
      //   senderId: currentUserId,
      //   receiverId: contactId,
      //   type: notificationModel.types.ADD_CONTACT,
      // };
      // await notificationModel.model.createNew(notificationItem);

      resolve(newGroupChat);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports= {
  addNewGroup: addNewGroup
}
