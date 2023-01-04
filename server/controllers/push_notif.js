const User = require("../models/user")
const UserDevice = require('../models/user_device')
const { body, check, validationResult } = require("express-validator")
const gcm = require("node-gcm")

User.hasMany(UserDevice, {targetKey:'id',foreignKey: 'user_id'})

exports.sendMessage = async (email, title, message) => {

  const androidDeviceTokens = await User.findAll({
    attributes: ["user_devices.push_user_id"],
    include: [
      { model: UserDevice, attributes: ["push_user_id"] }
    ],
    where: {
      email: email,
    },
  });

  var tokensArray = []

  // Set up the sender with your GCM/FCM API key (declare this once for multiple messages)
  var sender = new gcm.Sender(process.env.FCM_SERVER_KEY)

  // Prepare a message to be sent
  var gcmMessage = new gcm.Message()
  gcmMessage.addNotification("title", title)
  gcmMessage.addNotification("body", message)

  androidDeviceTokens.filter((res) => {
    if (res['user_devices'].length !== 0) {
      res['user_devices'].filter((ud) => {
        tokensArray.push(ud['dataValues']['push_user_id'])
      })
    }
  })

  // Actually send the message
  await sender.send(gcmMessage, { registrationTokens: tokensArray }, function (
    err,
    response
  ) {
    if (err) {
      console.error(err)
      return err
    } else {
      return response
    }
  })
}