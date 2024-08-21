interface GenerateEmailHTMLParams {
  headline: string;
  content: string;
  actionLink?: string;
  actionText?: string;
  unsubscribeToken?: string;
  imageUrl?: string;
}

const generateEmailHTML = async ({ headline, content, actionLink, actionText, unsubscribeToken, imageUrl }: GenerateEmailHTMLParams) => {
  const unsubscribeLink = `${process.env.NEXT_PUBLIC_SERVER_URL}/unsubscribe/${unsubscribeToken}`;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Notification from Tech Heavens</title>
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
        .action-link a {
          color: #fff;
          background-color: #007bff; 
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 5px;
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
          ${imageUrl ? `<img src="${imageUrl}" alt="${headline}" style="width: 200px; height: auto; margin-bottom: 10px;" />` : ''}
          <h2>${headline}</h2>
          <p>${content}</p>
          ${actionLink && actionText ? `<p class="action-link"><a href="${actionLink}">${actionText}</a></p>` : ''}
        </div>
        <footer class="unsubscribe">
        ${unsubscribeLink?` <p>You can unsubscribe from these notifications by clicking <a href="${unsubscribeLink}">here</a>.</p>`: ""}
        </footer>
      </div>
    </body>
    </html>
  `;
};

export default generateEmailHTML;