import notificationModel  from "./../model/notificationModel";
import userModel from "./../model/userModel";
/**
 * get notification when refresh page
 * just 10 items one time
 * @param {string} currentUserId 
 * @param {string} limit 
 */
let getNotifications = (currentUserId, limit =10) => {
  return new Promise(async (resolve, reject) =>{
    try {
      let notifications = await notificationModel.model.getByUserIdAndLimit( currentUserId, limit);
      
      let getNotfiContents = notifications.map(async (notification) => {
        let sender = await userModel.findUserById(notification.senderId);
        return notificationModel.contents.getContent(notification.type, notification.isRead, sender._id, sender.username, sender.avatar);
      });
      
      resolve( await Promise.all(getNotfiContents));
    } catch (error) {
      reject (error)
    }
  })
};

module.exports= {
  getNotifications: getNotifications,
};
