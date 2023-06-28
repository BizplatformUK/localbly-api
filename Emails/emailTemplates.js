const passwordResetTemplate = (link)=> {
    const html = `
        <html>
          <body style="margin: 0; padding: 0;">
          <table align="center" role="presentation" cellSpacing="0" cellPadding="0" border="0" width="100%" style="max-width:600px;margin:0 auto">
          <tr style="width:100%">
            <td>
              <table style="margin-top:32px" align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%">
                <tbody>
                  <tr>
                    <td><img alt="Slack" src="https://localblyimages.blob.core.windows.net/logos/logo.png" width="120" height="36" style="display:block;outline:none;border:none;text-decoration:none" /></td>
                  </tr>
                </tbody>
              </table>
              <h1 style="color:#1d1c1d;font-size:36px;font-weight:700;margin:30px 0;padding:0;line-height:42px">Reset Your Password</h1>
              <p style="font-size:20px;line-height:28px;margin:16px 0;margin-bottom:30px">Click on the Button below to reset your password.</p>
              <a href=${link} style="padding: 1rem 0.6rem; background-color: #109cf1; color: #fff">Reset Password</a>
              <p style="font-size:14px;line-height:24px;margin:16px 0;color:#000">If you didn&#x27;t request this email, there&#x27;s nothing to worry about - you can safely ignore it.</p>
              <table align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%">
                <tbody>
                  <tr>
                    <td>
                      <table width="100%" style="margin-bottom:32px;padding-left:8px;padding-right:8px;width:100%" align="center" role="presentation" cellSpacing="0" cellPadding="0" border="0">
                        <tbody style="width:100%">
                          <tr style="width:100%">
                            <td style="width:66%"><img alt="Slack" src="https://localblyimages.blob.core.windows.net/logos/logo.png" width="120" height="36" style="display:block;outline:none;border:none;text-decoration:none" /></td>
                            <td>
                              <table width="100%" align="center" role="presentation" cellSpacing="0" cellPadding="0" border="0">
                                <tbody style="width:100%">
                                  <tr style="width:100%">
                                    <td><a target="_blank" style="color:#067df7;text-decoration:none" href="/"><img alt="Slack" src="https://react-email-demo-ijnnx5hul-resend.vercel.app/static/slack-twitter.png" width="32" height="32" style="display:inline;outline:none;border:none;text-decoration:none;margin-left:32px" /></a></td>
                                    <td><a target="_blank" style="color:#067df7;text-decoration:none" href="/"><img alt="Slack" src="https://react-email-demo-ijnnx5hul-resend.vercel.app/static/slack-facebook.png" width="32" height="32" style="display:inline;outline:none;border:none;text-decoration:none;margin-left:32px" /></a></td>
                                    <td><a target="_blank" style="color:#067df7;text-decoration:none" href="/"><img alt="Slack" src="https://react-email-demo-ijnnx5hul-resend.vercel.app/static/slack-linkedin.png" width="32" height="32" style="display:inline;outline:none;border:none;text-decoration:none;margin-left:32px" /></a></td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%">
                <tbody>
                  <tr>
                      <p style="font-size:12px;line-height:15px;margin:16px 0;color:#b7b7b7;text-align:left;margin-bottom:50px">©2023 Localbly<br />All rights reserved.</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </table>
      
          </body>
        </html>
    `
    return html
}

function passwordresetTemplate(resetLink) {
    return `
      <html>
        <body>
        <table align="center" role="presentation" cellSpacing="0" cellPadding="0" border="0" width="100%" style="max-width:600px;margin:0 auto">
            <img alt="Localbly" src="https://localblyimages.blob.core.windows.net/logos/logo.png" width="120" height="36" style="display:block;outline:none;border:none;text-decoration:none" />
            <h1 style="color:#1d1c1d;font-size:36px;font-weight:700;margin:30px 0;padding:0;line-height:42px">Reset Password</h1>
            <p style="font-size:20px;line-height:28px;margin:16px 0;margin-bottom:30px">Click on the button below to reset your password</p>
            <a href="${resetLink}" target="_blank" style="font-size:14px;background-color:#109cf1;color:#fff;line-height:100%;border-radius:0.5em;padding:0px 0px;text-decoration:none;display:inline-block;max-width:100%">
                <span style="font-size:14px;background-color:#109cf1;color:#fff;line-height:120%;border-radius:0.5em;padding:0.85em 1.5em;max-width:100%;display:inline-block;text-decoration:none;text-transform:none;mso-padding-alt:0px;mso-text-raise:0">
                Reset Password
                </span>
            </a>
            <p style="font-size:14px;line-height:24px;margin:16px 0;color:#000">If you didn&#x27;t request this email, there&#x27;s nothing to worry about - you can safely ignore it.</p>
            <p style="font-size:12px;line-height:15px;margin:16px 0;color:#b7b7b7;text-align:left;margin-bottom:50px">©2023 Localbly, <br />website: <a href="">www.localbly.com</a><br /> Email:info@localbly.com<br />All rights reserved.</p>
        </table>
        </body>
      </html>
    `;
}

module.exports={passwordResetTemplate, passwordresetTemplate}