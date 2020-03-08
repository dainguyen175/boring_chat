import userModel from "./../model/userModel";
import bcrypt from "bcrypt";
import uuidv4 from "uuid/v4";
import {transErrors} from "./../../lang/vi";
import {transSuccess, transMail} from "./../../lang/vi";
import sendMail from "./../config/mailer";

let saltRounds = 7;

let register = (email, gender, password, protocol , host) => {
  return new Promise( async (resovle, reject)=> {
    let userByEmail = await userModel.findByEmail(email);

    if (userByEmail) {
      if(userByEmail.deletedAt != null) {
        return reject (transErrors.account_removed);  
      }  
      if(!userByEmail.local.isActive ) {
        return reject (transErrors.account_not_active);  
      }  
      return reject (transErrors.account_in_use);
    }
  
    let salt = bcrypt.genSaltSync(saltRounds);
  
    let userItem = {
      username: email.split("@")[0],
      gender: gender,
      local: {
        email: email,
        password: bcrypt.hashSync(password, salt),
        verifyToken: uuidv4()
      }
  };

  let user = await userModel.createNew(userItem); 
  let linkVerify= `${protocol}://${host}/verify/${user.local.verifyToken}`;
  //send email
  sendMail(email, transMail.subject , transMail.template(linkVerify))
    .then(succes => {  
      resovle(transSuccess.userCreated(user.local.email));
    })
    .catch(async (error) =>{
      //remove user
      await userModel.removeById(user._id);
      console.log(error);
      reject(transMail.send_failed)
    });
  });
};

let verifyAccount = (token) => {
  return new Promise( async (resovle, reject) =>{
    let userByToken = await userModel.findByToken(token);
    if (!userByToken){
      return reject(transErrors.token_undefined);
    }

    await userModel.verify(token);

    resovle(transSuccess.account_actived);
  });
};

module.exports = {
  register: register,
  verifyAccount: verifyAccount
}; 
