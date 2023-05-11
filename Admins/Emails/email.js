const schedule = require('node-schedule');
const nodemailer = require('nodemailer');
const {emailTemplate} = require('./emailTemplates')

function sendMonthlyEmailNotification(host, port, user, userEmail, registrationDate, name, price, link) {
    // Create a transporter object to send emails
    const transporter = nodemailer.createTransport({
        host: host,
        port: port,
        secure:true,
        auth:{
          user:user,
          pass: process.env.MAIL_PASS
        }
    })


  
    // Calculate the next notification date based on the user's registration date
    const lastDayOfMonth = new Date(registrationDate.getFullYear(), registrationDate.getMonth() + 1, 0);
    
    const emailDate = new Date(lastDayOfMonth.getTime() - 7 * 24 * 60 * 60 * 1000);
    // Create a schedule rule to send email on the next notification date
    const job = schedule.scheduleJob(emailDate, function() {
      // Send email to user
      const mailOptions = {
        from: user,
        to: userEmail,
        subject: 'Subscription Renewal',
        html: emailTemplate(name, link, price)
      };
  
      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    });
  }

  module.exports={sendMonthlyEmailNotification}