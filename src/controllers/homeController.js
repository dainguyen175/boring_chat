import {notification, contact, message} from "./../services/index";
import {bufferToBase64, lastItemOfArray, convertTimestampToHumanTime} from "./../helpers/clientHelper";
import request from "request";

let getICETurnServer = () =>{
  return new Promise(async (resolve,reject)=>{
    // Node Get ICE STUN and TURN list
    let o = {
      format: "urls"
    };

    let bodyString = JSON.stringify(o);
    
    let options = {
      url: "https://global.xirsys.net/_turn/Boring-chat",
      // host: "global.xirsys.net",
      // path: "/_turn/Boring-chat",
      method: "PUT",
      headers: {
        "Authorization": "Basic " + Buffer.from("dainguyen175:051460f0-9398-11ea-b1d1-0242ac150006").toString("base64"),
        "Content-Type": "application/json",
        "Content-Length": bodyString.length
      }
    };

    // call a request to get ICE list of turn server
    request(options, (error, response, body) => {
      if (error){
        console.log("Error when get ICE list: "+ error);
        return reject(error);
      }
      
      let bodyJson = JSON.parse(body);
      resolve(bodyJson.v.iceServers);
    })

    
  });
};

let getHome = async (req, res) => {
  // only 10 items one time
  let notifications =await notification.getNotifications(req.user._id)

  // get amount notification unread
  let countNotifUnread = await notification.countNotifUnread(req.user._id);

  // get contacts (10 items one time )
  let contacts = await contact.getContacts(req.user._id);

  // get contacts sent(10 items one time )
  let contactsSent = await contact.getContactsSent(req.user._id);

  // get contacts received(10 items one time )
  let contactsReceived = await contact.getContactsReceived(req.user._id);

  //count contacts 
  let countAllContacts = await contact.countAllContacts(req.user._id);
  let countAllContactsSent= await contact.countAllContactsSent( req.user._id);
  let countAllContactsReceived= await contact.countAllContactsReceived( req.user._id);

  let getAllConversationItems = await message.getAllConversationItems(req.user._id);
  
  //all conversation with conversation, max 30 items
  let allConversationWithMessages = getAllConversationItems.allConversationWithMessages;

  // get ICE list from xirsys turn server 
  let iceServersList = await getICETurnServer();

  return res.render("main/home/home", {
    errors: req.flash("errors"),
    success: req.flash("success"),
    user: req.user,
    notifications :notifications,
    countNotifUnread: countNotifUnread,
    contacts: contacts,
    contactsSent: contactsSent,
    contactsReceived: contactsReceived,
    countAllContacts: countAllContacts,
    countAllContactsSent: countAllContactsSent,
    countAllContactsReceived: countAllContactsReceived,
    allConversationWithMessages :allConversationWithMessages,
    bufferToBase64: bufferToBase64,
    lastItemOfArray: lastItemOfArray,
    convertTimestampToHumanTime: convertTimestampToHumanTime,
    iceServersList: JSON.stringify(iceServersList),
  });
};

module.exports= {
  getHome: getHome
};
 