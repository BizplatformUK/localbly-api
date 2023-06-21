const { EmailClient } = require("@azure/communication-email");


const connectionString = process.env.COMMUNICATION_SERVICES_CONNECTION_STRING;
let displayName = "localblyRegister"

const emailClient = new EmailClient(connectionString);

async function pollEmailService(receiverEmailAddress, emailSubject,emailMessage){
  const message = {
    senderAddress:process.env.SENDER_EMAIL,
    content: {
      subject: emailSubject,
      plainText:"Return this value",
      plainText:emailMessage,
     // html: emailMessage,
    }, 

    recipients:{
      to: [{address: receiverEmailAddress,displayName: displayName}]
    }
  }
  const POLLER_WAIT_TIME = 10;
  const poller = await emailClient.beginSend(message);
  return poller;
}

const sendEmail = async(req,res)=> {
  const {email, subject, message} = req.body;
  try{
    const sent = pollEmailService(email, subject, message);
    res.status(200).json(sent)
  }catch(error){
    return res.status(500).json(error)
  }
}


  
 

  module.exports={sendEmail}