const mongoose = require("mongoose");

const UserInfoSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "",
  },
  friends:[]
});

const UserInfoModel = mongoose.model("userInformation", UserInfoSchema);

module.exports = UserInfoModel;
