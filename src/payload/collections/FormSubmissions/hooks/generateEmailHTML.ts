const generateEmailHTML = async ({ headline, content  }) => {
    const unsubscribeLink = `${process.env.NEXT_PUBLIC_SERVER_URL}/unsubscribe/[unsubscribeToken]`;
  
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>A New Email</title>
        <style>
          body {
            font-family: sans-serif;
            margin: 0;
            padding: 0;
          }
          a {
            color: #333;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
          .container {
            padding: 20px;
            max-width: 600px;
            margin: 0 auto;
          }
          .header {
            margin-bottom: 20px;
          }
          .content {
            line-height: 1.5;
          }
          .unsubscribe {
            font-size: smaller;
            text-align: center;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <h1>Tech Heavens</h1>
          </header>
          <div class="content">
            <h2>${headline}</h2>
            <p>${content}</p>
          </div>
          <footer class="unsubscribe">
            <p>You can unsubscribe from these notifications by clicking <a href="${unsubscribeLink}">here</a>.</p>
          </footer>
        </div>
      </body>
      </html>
    `;
  };
  export default generateEmailHTML;
  