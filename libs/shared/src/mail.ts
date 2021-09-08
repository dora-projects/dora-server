import nodemailer, { SentMessageInfo } from 'nodemailer';

function detectTransport(): string | any {
  if (process.env.EMAIL_SERVER_HOST) {
    const port = parseInt(process.env.EMAIL_SERVER_PORT);
    return {
      host: process.env.EMAIL_SERVER_HOST,
      port,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
      secure: port === 465,
    };
  }

  return {
    sendmail: true,
    newline: 'unix',
    path: '/usr/sbin/sendmail',
  };
}

const getMailConfig = () => {
  return {
    transport: detectTransport(),
    from: process.env.EMAIL_FROM,
  };
};

export const sendEmail = ({
  to,
  subject,
  text,
  html = null,
}): Promise<string | SentMessageInfo> =>
  new Promise((resolve, reject) => {
    const { transport, from } = getMailConfig();

    if (!to || !subject || (!text && !html)) {
      return reject('Missing required elements to send email.');
    }

    nodemailer.createTransport(transport).sendMail(
      {
        from: `Bastion ${from}`,
        to,
        subject,
        text,
        html,
      },
      (error, info) => {
        if (error) {
          return reject(error.message);
        }
        return resolve(info);
      },
    );
  });

export default sendEmail;
