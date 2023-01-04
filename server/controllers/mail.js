const nodemailer = require("nodemailer");
const emailTemplate = require('./utils/email-template-2')
const emailTemplate2 = require('./utils/email-template2')
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendEmail = async (email, title, body) => {
  try {    
    const msg = {
      to: email,
      from: process.env.MAILER_SENDER, 
      subject: '[Axesspoint] ' + title,
      html: emailTemplate.send(title, body),
    };

    await sgMail.send(msg);
    console.log('email sent to ', email);
  } catch (err) {
    return err.toString('utf8')
  }
}

exports.sendEmail2 = async (email, title, body, link, linkText) => {
  try {    
    const loginPath = process.env.BASE_URL + '/'
    const msg = {
      to: email,
      from: process.env.MAILER_SENDER, 
      subject: '[Axesspoint] ' + title,
      html: emailTemplate2.send(title, body, loginPath+link, linkText),
    };

    await sgMail.send(msg);
    console.log('email sent to ', email);
  } catch (err) {
    return err.toString('utf8')
  }
}


exports.sendEmail_1 = (email, req, h1_title, p_body) => {
  // const hostname = req.headers.host
  var transport = nodemailer.createTransport({
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT,
    secure: false, // use SSL
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
  });

  // var transport = nodemailer.createTransport({
  //   service: 'gmail',
  //   auth: {
  //         user: 'john@axesspoint.net',
  //         pass: 'mfgpmrymgnxotvyr'
  //     }
  // });

  // const protocol = getProtocol(req)
  // const loginPath = protocol + "://" + hostname + '/'

  const message = {
    from: process.env.MAILER_USER, // Sender address
    to: email, // List of recipients
    subject: '[Axesspoint] ' + h1_title, // Subject line
    // text: 'Have the most fun you can in a car. Get your Tesla today!' // Plain text body
    // html: '<p>Thank you for requesting to reset your password. Click <a href="'+hostname+'">here</a>.</p>'
    // html: '<p>To reset your password please click <a href="http://localhost:5000/reset?token=' + token + '">here</a> valid for 30 minutes.</p>',
    // html: '<p>One new maintenance request created. Please login <a href="' + loginPath + '">here</a></p>'
    html: emailTemplate.send(h1_title, p_body)
  };
  transport.sendMail(message, function(err, info) {
    if (err) {
      console.log(err)
    } else {
      console.log('email sent to ', email);
      // res.json(hostname)
    }
  });
}

exports.sendEmail_2 = (email, req, h1_title, p_body, link, linkText) => {
  const hostname = req.headers.host
  var transport = nodemailer.createTransport({
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT,
    secure: false, // use SSL
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
  });

  // var transport = nodemailer.createTransport({
  //   service: 'gmail',
  //   auth: {
  //         user: 'john@axesspoint.net',
  //         pass: 'mfgpmrymgnxotvyr'
  //     }
  // });

  const protocol = getProtocol(req)
  const loginPath = protocol + "://" + hostname + '/'

  const message = {
    from: process.env.MAILER_USER, // Sender address
    to: email, // List of recipients
    subject: '[Axesspoint] ' + h1_title, // Subject line
    // text: 'Have the most fun you can in a car. Get your Tesla today!' // Plain text body
    // html: '<p>Thank you for requesting to reset your password. Click <a href="'+hostname+'">here</a>.</p>'
    // html: '<p>To reset your password please click <a href="http://localhost:5000/reset?token=' + token + '">here</a> valid for 30 minutes.</p>',
    // html: '<p>One new maintenance request created. Please login <a href="' + loginPath + '">here</a></p>'
    html: emailTemplate2.send(h1_title, p_body, loginPath+link, linkText)
  };
  transport.sendMail(message, function(err, info) {
    if (err) {
      console.log(err)
    } else {
      console.log('email sent to ', email);
      // res.json(hostname)
    }
  });
}

function getProtocol(req) {
  var proto = req.connection.encrypted ? 'https' : 'http';
  // only do this if you trust the proxy
  proto = req.headers['x-forwarded-proto'] || proto;
  return proto.split(/\s*,\s*/)[0];
}