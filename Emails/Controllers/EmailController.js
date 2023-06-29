const { EmailClient } = require("@azure/communication-email");
const {serialKey} = require('../../Utils/Auth')
const {getByID, getuserBYEmail, updateData} = require('../../config/sqlfunctions');
const {passwordresetTemplate, welcomeEmail} = require('../emailTemplates')

require('dotenv').config()

const connectionString = process.env.COMMUNICATION_SERVICES_CONNECTION_STRING;
let displayName = "localblyRegister"

const emailClient = new EmailClient(connectionString);

async function pollEmailService(receiverEmailAddress, emailSubject,emailMessage){
  try{
    const message = {
      senderAddress:process.env.SENDER_EMAIL,
      content: {
        subject: emailSubject,
        plainText:"Return this value",
        html:emailMessage,
       // html: emailMessage,
      }, 
  
      recipients:{
        to: [{address: receiverEmailAddress,displayName: displayName}]
      }
    }
    const POLLER_WAIT_TIME = 10;
    const poller = await emailClient.beginSend(message);
    const response = await poller.pollUntilDone();
    
    return response;
  }catch(error){
    return error
  }
}

const sendEmail = (email, name)=> {
  try{
    const message = welcomeEmail(name)
    const subject = 'Welcome To Localbly'
    const sent =  pollEmailService(email, subject, message);
    return sent
  }catch(error){
    return res.status(500).json(error)
  }
}

const resetPassword = async(req,res)=> {
  const {email} = req.body;
  try{
    const user = await getuserBYEmail(email);
    if(!user){return res.status(200).json({message: 'user not found matching email', code:3})}
    const token = serialKey()
    const params = {resetToken:token}
    const update = await updateData(user.id, params, 'users');  
    const subject = 'Reset password';
    const url = process.env.RESET_PASSWORD_LINK + token
    const message = passwordresetTemplate(url)
    const sent = pollEmailService(email, subject, message)
    let timeout = 10 * 60 * 1000; 
    setTimeout(async () => {
      const params = {resetToken: 'na' };
      await updateData(user.id, params, 'users');
    }, timeout);
    
    res.status(200).json(sent)
  }catch(error){
    return error
  }
}


  
 

module.exports={sendEmail, resetPassword}