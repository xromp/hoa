const User = require("../models/user")
const { body, check, validationResult } = require("express-validator")
const gcm = require("node-gcm")

exports.SendMessage = async (email, title, message) => {

  const androidDeviceTokens = await User.findAll({
    attributes: ["push_token"],
    where: {
      email: email,
    },
  });

  const tokensArray = androidDeviceTokens.map((u) => u.get("push_token"))

  // Set up the sender with your GCM/FCM API key (declare this once for multiple messages)
  var sender = new gcm.Sender(process.env.FCM_SERVER_KEY)

  // Prepare a message to be sent
  var gcmMessage = new gcm.Message()
  gcmMessage.addNotification("title", title)
  gcmMessage.addNotification("body", message)

  // Actually send the message
  sender.send(gcmMessage, { registrationTokens: tokensArray }, function (
    err,
    response
  ) {
    if (err) {
      console.error(err)
      return err
    } else {
      console.log(response)
      return response
    }
  })
}