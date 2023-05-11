const emailTemplate = (name, link, price)=> {
    const html = `
        <html>
          <head>
            <meta charset="UTF-8">
            <title>Verify Your Email Address</title>
          </head>
          <body style="margin: 0; padding: 0;">
          <table cellSpacing="0" cellPadding="0" style="margin:0px; width: 100%; background-color:#fff; ">
          <tbody>
              <tr>
                  <td>
                      <div
                          style="background-color: #fff; border: 1px solid #eee; box-sizing: border-box; font-family: Lato, Helvetica, 'Helvetica Neue', Arial, 'sans-serif'; margin: auto; max-width: 600px; overflow: hidden; width: 600px;">
                          <div
                              style="padding: 65px 90px 20px; background-color: #1f1b2d; background-repeat: no-repeat; background-position: top right; background-size: 140px;">
                              <h4 style="color: #fff; font-weight: bold; font-size: 16px; margin: 0; margin-bottom: 10px;">
                                  Dear <strong style="color: #fd5630">${name}</strong></h4>
                          </div>
                          <div style="padding: 25px 90px 65px;">
                              <p style="font-size: 14px; margin: 0; line-height: 20px;">
                                  Your shelf space rent of ${price} is due in one week, pay now to avoid interruptions, use the link below to pay </p>
                              <a href="${link}"
                                  style="border: none; border-radius: 4px; color: #1f1b2d; cursor: pointer; display: inline-block; font-size: 14px; font-weight: bold; text-decoration: none; padding: 12px 24px; background-color: #ffdd00; margin: 20px 0 30px;">Verify
                                  your account</a>
                              <p style="font-size: 14px; margin: 0; margin-bottom: 30px; line-height: 20px;">Have any
                                  Question? Check out our <a href="" style="color:#fd5630">FAQ</a> page or
                                  <a href="" style="color: #fd5630">Contact Us</a>
                              </p>
      
                              <p style="font-size: 14px; margin: 0; line-height: 20px;">Thank you,</p>
                              <p style="font-size: 14px; margin: 0; line-height: 20px;">Team</p>
                              
                          </div>
                      </div>
                  </td>
              </tr>
          </tbody>
      </table>
      
          </body>
        </html>
    `
    return html
}

module.exports={emailTemplate}