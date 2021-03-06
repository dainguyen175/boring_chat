import notificationModel  from "./../model/notificationModel";
import userModel from "./../model/userModel";
import { notification } from ".";


const LIMIT_NUMBER_TAKEN= 10;
/**
 * get notification when refresh page
 * just 10 items one time
 * @param {string} currentUserId  
 */
let getNotifications = (currentUserId) => {
  return new Promise(async (resolve, reject) =>{
    try {
      let notifications = await notificationModel.model.getByUserIdAndLimit( currentUserId, LIMIT_NUMBER_TAKEN);
      
      let getNotfiContents = notifications.map(async (notification) => {
        let sender = await userModel.getNormalUserDataById(notification.senderId);
        return notificationModel.contents.getContent(notification.type, notification.isRead, sender._id, sender.username, sender.avatar);
      });
      
      resolve( await Promise.all(getNotfiContents));
    } catch (error) {
      reject (error)
    }
  })
};

/**
 * count all notification unread
 * @param {string} currentUserId 
 */
let countNotifUnread = (currentUserId) => {
  return new Promise(async (resolve, reject) =>{
    try {
      let notificationsUnread =await notificationModel.model.countNotifUnread(currentUserId);
      resolve(notificationsUnread);
    } catch (error) {
      reject (error)
    }
  })
};

/**
 * Read more notification, max 10 items one time
 * @param {string} currentUserId 
 * @param {number} skipNumberNotification 
 */
let readMore = (currentUserId, skipNumberNotification) => {
  return new Promise(async (resolve, reject) =>{
    try {
      let newNotifications = await notificationModel.model.readMore(currentUserId, skipNumberNotification, LIMIT_NUMBER_TAKEN);
      
      let getNotfiContents = newNotifications.map(async (notification) => {
        let sender = await userModel.getNormalUserDataById(notification.senderId);
        return notificationModel.contents.getContent(notification.type, notification.isRead, sender._id, sender.username, sender.avatar);
      });
      
      resolve( await Promise.all(getNotfiContents));
    } catch (error) {
      reject (error);
    }
  });
};

/**
 * Mark notification as read
 * @param {string} currentUserId 
 * @param {array} targetUsers 
 */
let markAllAsRead = (currentUserId, targetUsers) => {
  return new Promise(async (resolve, reject) =>{
    try {
      await notificationModel.model.markAllAsRead(currentUserId, targetUsers);
      resolve (true);
    } catch (error) {
      console.log(`Error when mark notification as read: ${error}`)
      reject (false);
    }
  });
};


module.exports= {
  getNotifications: getNotifications,
  countNotifUnread: countNotifUnread,
  readMore: readMore,
  markAllAsRead: markAllAsRead,
};
