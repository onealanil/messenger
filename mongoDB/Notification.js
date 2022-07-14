const mongoose = require('mongoose');

const Notification = new mongoose.Schema({
   receiverId:{
     type:String,
   },
   senderId:{
       type:String,
   },
   notificationMsg:{
       type:String
   }
  });
  
  
  
  const NotificationModel = mongoose.model("notification", Notification);
  
  module.exports = NotificationModel;
  