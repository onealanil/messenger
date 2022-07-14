const mongoose = require("mongoose");
const url = "mongodb+srv://Onealanil:o00ryox13JUQeclp@cluster0.equk5.mongodb.net/messengerMERN?retryWrites=true&w=majority";
mongoose
  .connect(url, {
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("mongodb is connected");
  })
  .catch((err) => {
    console.log(err);
  });
