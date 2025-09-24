export default {
  subject: 'Reset your password for <%= PROJECT_NAME %>',
  text: `
    Hello <%= user.username %>,
    
    You requested a password reset for your <%= PROJECT_NAME %> account.
    
    Please click on the following link to reset your password:
    <%= URL %>?code=<%= CODE %>
    
    This link will expire in 15 minutes.
    
    If you didn't request this, please ignore this email.
    
    Best regards,
    <%= PROJECT_NAME %> Team
  `,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .button { 
          display: inline-block; 
          padding: 12px 24px; 
          background-color: #4CAF50; 
          color: white; 
          text-decoration: none; 
          border-radius: 4px; 
        }
        .footer { margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Reset Your Password</h2>
        <p>Hello <%= user.username %>,</p>
        <p>You requested a password reset for your <%= PROJECT_NAME %> account.</p>
        <p>Please click the button below to reset your password:</p>
        <p><a href="<%= URL %>?code=<%= CODE %>" class="button">Reset Password</a></p>
        <p>Or copy and paste this link into your browser:</p>
        <p><%= URL %>?code=<%= CODE %></p>
        <p><strong>This link will expire in 15 minutes.</strong></p>
        <p>If you didn't request this, please ignore this email.</p>
        <div class="footer">
          <p>Best regards,<br><%= PROJECT_NAME %> Team</p>
        </div>
      </div>
    </body>
    </html>
  `,
};
