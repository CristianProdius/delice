export default {
  subject: 'Confirm your email for <%= PROJECT_NAME %>',
  text: `
    Welcome <%= user.username %>!
    
    Please confirm your email address by clicking the link below:
    <%= URL %>?confirmation=<%= CODE %>
    
    Thank you for joining <%= PROJECT_NAME %>!
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
          background-color: #2196F3; 
          color: white; 
          text-decoration: none; 
          border-radius: 4px; 
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Welcome to <%= PROJECT_NAME %>!</h2>
        <p>Hi <%= user.username %>,</p>
        <p>Thanks for creating an account. Please confirm your email address:</p>
        <p><a href="<%= URL %>?confirmation=<%= CODE %>" class="button">Confirm Email</a></p>
        <p>Thank you for joining us!</p>
      </div>
    </body>
    </html>
  `,
};
