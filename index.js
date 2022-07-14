const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 5000;
const cors = require("cors");
const userRoute = require("./loginSignup/user");
require("dotenv").config();

require("./mongoDB/Connection");
const path = require("path");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use("/", userRoute);
const userInfo = require("./mongoDB/UserInfo");
const notification = require("./mongoDB/Notification");
const Conversation = require("./mongoDB/Conversation");
const Message = require("./mongoDB/Message");

app.get("/", (req, res) => {
  res.send("Hello world");
});

//socket io
const socketIO = require("socket.io");
const http = require("http");
const { findById } = require("./mongoDB/UserInfo");
const server = http.createServer(app);

const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let onlineUsers = [];

const addNewUser = (userId, socketId) => {
  !onlineUsers.some((user) => user.userId === userId) &&
    onlineUsers.push({ userId, socketId });
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUsers.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  //for online users
  socket.on("clientUsername", (data) => {
    addNewUser(data.userId, socket.id);
    io.emit("clientInfo", onlineUsers);
  });

  socket.on("message", ({ senderId, receiverId, notificationMsg }) => {
    const receiver = getUser(receiverId);
    if (receiver) {
      // io.to(socketIdReceiver).emit("messageFromBack", data);
      io.to(receiver.socketId).emit("messageFromBack", {
        senderId,
        notificationMsg,
        receiverId,
      });
    }
  });

  socket.on("textMessage", ({ sender, receiver, message }) => {
    const socketIdReceiver = getUser(receiver);
    if (socketIdReceiver) {
      console.log("thisis", message , sender)
      io.to(socketIdReceiver.socketId).emit("textMessageFromBack", {
        sender,
        receiver,
        message,
      });
    }
    // io.to(socketIdReceiver).emit("textMessageFromBack", data);
  });

  //disconnect
  socket.on("disconnect", () => {
    removeUser(socket.id);
    io.emit("clientInfo", onlineUsers);
  });
});

//notification
app.post("/notification", async (req, res) => {
  try {
    const senderId = req.body.senderId;
    const receiverId = req.body.receiverId;
    const notificationMsg = req.body.notificationMsg;

    const notificationInfo = await new notification({
      senderId,
      receiverId,
      notificationMsg,
    }).save();
    res.status(200).json({ notificationInfo });
  } catch (err) {
    console.log(err);
  }
});

//get notification
app.get("/getNotification/:id", async (req, res) => {
  try {
    const n = await notification.find({
      $or: [{ senderId: req.params.id }, { receiverId: req.params.id }],
    });
    res.status(200).json({ n });
  } catch (err) {
    console.log(err);
  }
});

app.get("/deleteNotification/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await notification.deleteMany({ receiverId: id });
  } catch (err) {
    console.log(err);
  }
});

//conversation
//conversation = combo
app.post("/conversation", async (req, res) => {
  try {
    console.log(req.body);
    const conversation = new Conversation({
      conversation: [req.body.senderId, req.body.receiverId],
    });
    await conversation.save();
    res.status(200).json({ conversation });
  } catch (err) {
    console.log(err);
  }
});

//get all conversation which contains my id
app.get("/conversation/:id", async (req, res) => {
  try {
    const id = req.params.id;
    Conversation.find({ conversation: { $in: [id] } }, (err, result) => {
      if (err) {
        console.log("something went wrong");
      }
      res.status(200).json({ result });
    });
  } catch (err) {
    console.log(err);
  }
});

//for message
//messages
app.post("/messages", async (req, res) => {
  try {
    const messages = new Message(req.body);
    await messages.save();
    res.status(200).json({ messages });
  } catch (err) {
    console.log(err);
  }
});

//get message of conversation of user
app.get("/messagesCombo/:id", async (req, res) => {
  try {
    const id = req.params.id;
    Message.find({ conversationId: id }, (err, result) => {
      if (err) {
        console.log("something went wrong");
      }
      res.status(200).json({ result });
    });
  } catch (err) {
    console.log(err);
  }
});

//heroku
if(process.env.NODE_ENV === "production"){
  app.use(express.static("messenger/build"));
}

server.listen(process.env.PORT || PORT, (err) => {
  if (err) console.log(err);
  console.log("server is running ");
});
