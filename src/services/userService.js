import userModel from "./../model/userModel";

/**
 * Update user info
 * @param {userId} id 
 * @param {data update} item 
 */
let updateUser = (id, item) =>{
  return userModel.updateUser(id, item);
};
module.exports ={
  updateUser: updateUser
}
