const express = require("express");
const dotenv = require("dotenv");
const route = express.Router();
const UserInfoModel = require("../mongoDB/UserInfo");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const authenticate = require("../middleware");
const path = require("path");
require("../mongoDB/Connection");
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

//multer
const multer = require("multer");

//setting up the multer diskstorage
const storage = new multer.diskStorage({
  destination: "./public/uploads",
  filename: function (req, file, callback) {
    callback(
      null,
      file.fieldname + "-" + Date.now() + "-" + path.extname(file.originalname)
    );
  },
});

//init the uploads
const upload = multer({
  storage: storage,
});

//signup
route.post("/signup", async (req, res) => {
  try {
    const { username, email, password, gender } = req.body;
    const findEmail = await UserInfoModel.findOne({ email });
    const findUsername = await UserInfoModel.findOne({ username });
    if (findEmail) {
      return res.status(422).json({ message: "email already exists" });
    }
    if (findUsername) {
      return res.status(422).json({ message: "username already exists" });
    }
    if (password.length <= 8) {
      return res
        .status(422)
        .json({ message: "Your password must contains at least 8 letter" });
    }
    if (username.length <= 3 || username.length >= 14) {
      return res.status(422).json({
        message:
          "Your username must contains at least 3 letter and not more than 14 letters",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const signupUser = new UserInfoModel({
      email,
      password: hashedPassword,
      username,
      gender,
    });
    await signupUser.save();
    res.status(200).json({ signupUser });
  } catch (err) {
    console.log(err);
  }
});

//login
route.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const findEmail = await UserInfoModel.findOne({ email });
  if (!findEmail || findEmail == null) {
    res.status(422).json({ message: "Email not found" });
  } else {
    const decryptPass = await bcrypt.compare(password, findEmail.password);
    if (decryptPass) {
      jwt.sign({ userId: findEmail._id }, SECRET_KEY, (err, token) => {
        if (err) {
          return res.status(404).json({ message: "You must login first" });
        }
        res.status(200).json({ token: token, data: findEmail });
      });
    } else {
      res.status(422).json({ message: "Email or Password doesn't match" });
    }
  }
});

//protected auth for home
route.get("/home", authenticate, (req, res) => {
  res.json({ message: req.user });
});

//home
route.get("/user/:id", async (req, res) => {
  const id = req.params.id;
  const findUserDetails = await UserInfoModel.findOne({ _id: id });
  if (findUserDetails) {
    res.status(200).json({ findUserDetails });
  } else {
    res.status(422).json({ message: "something went wrong" });
  }
});

//protected auth for profile
route.get("/profile", authenticate, (req, res) => {
  res.json({ message: req.user });
});
//protected auth for notification
route.get("/notification", authenticate, (req, res) => {
  res.json({ message: req.user });
});

//protected auth for active
route.get("/active", authenticate, (req, res) => {
  res.json({ message: req.user });
});
//protected auth for conversation list
route.get("/conversationList", authenticate, (req, res) => {
  res.json({ message: req.user });
});
//protected auth for conversation list
route.get("/friendReq", authenticate, (req, res) => {
  res.json({ message: req.user });
});

//update
route.post("/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const bio = req.body.bio;
    const username = req.body.username;
    if (bio === "" || username === "") {
      res.status(404).send("Username or bio can't be null");
    } else {
      await UserInfoModel.findByIdAndUpdate(
        { _id: id },
        { bio: bio, username: username }
      );

      res.status(200).send("Updated successfully");
    }
  } catch (err) {
    res.status(404).send("Something went wrong when updating your data");
  }
});

route.post(
  "/updateProfilePicture",
  upload.single("postImg"),
  async (req, res) => {
    try {
      const id = req.body.id;
      const img = req.file.path;

      await UserInfoModel.findOneAndUpdate(
        { _id: id },
        { $set: { profilePic: img } },
        (err, result) => {
          if (err) {
            console.log("error while rendering the user");
          }
          res.send({ result });
        }
      );
    } catch (err) {
      console.log(err);
    }
  }
);

route.get("/allUsers/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await UserInfoModel.find({ _id: { $ne: id } });
    // const data = await UserInfoModel.find({_id:id},{friends});
    res.status(200).json({ data });
  } catch (err) {
    console.log(err);
  }
});

//friend id
route.get("/friend/:id", async (req, res) => {
  try {
    const id = req.params.id;
    UserInfoModel.find({ _id: id }, (err, result) => {
      if (err) {
        console.log("something went wrong");
      }
      res.status(200).json(result);
    });
  } catch (err) {
    console.log(err);
  }
});

//for push friend
route.post("/addFriend", async (req, res) => {
  try {
    const id = req.body.myId;
    const frnId = req.body.friendId;

    console.log(id, frnId)

    UserInfoModel.findById(id, (err, result) => {
      if (err) {
        console.log(err);
      }
      if (result.friends.indexOf(frnId) !== -1) {
        console.log("data already exists");
      } else {
        UserInfoModel.updateOne(
          { _id: id },
          { $push: { friends: frnId } },
          (err, result) => {
            if (err) {
              console.log("what is the error");
            }
          }
        );
        UserInfoModel.updateOne(
          { _id: frnId },
          { $push: { friends: id } },
          (err, result) => {
            if (err) {
              console.log(err);
            }
          }
        );
      }
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = route;
