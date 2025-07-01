global.__basedir = __dirname;

const AsyncPolling = require("async-polling");
const sql = require("mssql");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const _dbConfig = require("./config/database.json");
const defaultSMTPConfig = require("./config/smtp.json");
const _oAuthConfig = require("./config/oauth.json");

let pool1 = undefined;
let conn1 = undefined;

// support environment variables
let dbConfig = {
  ..._dbConfig,
  user: process.env.DB_USERNAME || _dbConfig.user,
  password: process.env.DB_PASSWORD || _dbConfig.password,
  server: process.env.DB_HOST || _dbConfig.server,
  port: parseInt(process.env.DB_PORT || _dbConfig.port),
  database: process.env.DB_NAME || _dbConfig.database,
};

if (pool1 == undefined) {
  pool1 = new sql.ConnectionPool(dbConfig);
}

let totalEmails;
let totalProcessedEmails;

let transporter;
let multiTransporters = [];

const start = async function (end) {
  totalEmails = 0;
  totalProcessedEmails = 0;
  multiTransporters = [];

  // single database
    try {
      if (!conn1) conn1 = await pool1.connect();

      let results = await conn1
        .request()
        .query(`SELECT Id, RecipientEmail, Body, Subject, SenderEmail FROM tblEmails`);

      results = results.recordset;

      if (results.length == 0) {
        end();
        return;
      }

      await createTransporter(_oAuthConfig);

      totalEmails = results.length;

      for (let i = 0; i < results.length; i++) {
        let email = results[i];
        email.messageId = i + 1;
        email.SMTPHost = _oAuthConfig.SMTPHost
        email.SMTPUserName = _oAuthConfig.SMTPUserName
        email.SMTPSenderAddress = _oAuthConfig.SMTPSenderAddress
        sendEmail(email, (err, messageId) => {
          (async function () {
            try {
              if (err) {
                console.log('err: ', err);
              } else {

              }
            } finally {
              totalProcessedEmails += 1;

              if (
                totalEmails + totalProcessedEmails > 0 &&
                totalEmails <= totalProcessedEmails
              ) {
                totalProcessedEmails = 0;
                end();
                return;
              }
            }
          })();
        });
      }
    } catch (err) {
      end();
    }
  }

async function createTransporter(smtp) {
  let smtpConfig = defaultSMTPConfig;

  smtpConfig.host = smtp.SMTPHost;
  smtpConfig.port = 465
  smtpConfig.maxMessages = Infinity

  // For Gmail
  let accessToken;
  let refreshToken;
  let isGmail = false;

    try {
      const oAuth2 = google.auth.OAuth2;
      const oAuth2Client = new oAuth2(
        smtp.clientId,
        smtp.secretKey,
        "urn:ietf:wg:oauth:2.0:oob"
      );

      if (smtp.authorizationCode !== "" && smtp.authorizationCode !== null) {
        console.log('test')
        oAuth2Client.setCredentials({
          refresh_token: smtp.refreshToken,
        });
        accessToken = await oAuth2Client.getAccessToken();
        console.log('accessToken: ', accessToken);
      } else {
        oAuth2Client.getToken(smtp.OAUTHAuthorizationCode, (err, token) => {
          if (err) return console.error("Error getting token:", err);
          accessToken = token.access_token;
          refreshToken = token.refresh_token;
          smtp.OAuthAccessToken = accessToken;
          smtp.OAuthRefreshToken = refreshToken;
          isGmail = true;
        });
      }
    } catch (err) {
      console.error(err.message);
    }

    smtpConfig.secure = true;
    smtpConfig.auth = {
      type: "OAuth2",
      clientId: smtp.clientId,
      clientSecret: smtp.secretKey,
      user: smtp.SMTPSenderAddress,
    };

    if (smtp.OAuthRefreshToken) {
      smtpConfig.auth.refreshToken = smtp.OAuthRefreshToken;
    }

    if (smtp.accessToken) {
      smtpConfig.auth.accessToken = accessToken.token || smtp.accessToken;
    }

    if (smtp.OAuthRedirectURL && isGmail === false) {
      smtpConfig.auth.accessUrl = smtp.OAuthRedirectURL;
    }

  multiTransporters[getTransporterName(smtp)] =
    nodemailer.createTransport(smtpConfig);
}

function getTransporterName(smtp) {
  return (smtp.SMTPHost + smtp.SMTPUserName + smtp.SMTPSenderAddress)
    .toLowerCase()
    .replace(/\s/g, "");
}

const sendEmail = async function (email, callBack) {
  try {
    let emailToAddresses = [];

    if (email.RecipientEmail.indexOf(";") > -1) {
      for (let emailToAddress of email.RecipientEmail.split(";")) {
        emailToAddresses.push(emailToAddress);
      }
    } else {

      emailToAddresses.push(email.RecipientEmail);
    }

    let emailConfig = {
      from: email.SenderEmail,
      subject: email.Subject,
      html: email.Body,
      messageId: email.messageId.toString(),
    };

    for (let emailTo of emailToAddresses) {
      if (emailTo !== "") {
        emailConfig["to"] = emailTo;

        multiTransporters[getTransporterName(email)].sendMail(
          emailConfig,
          (err, info) => {
          }
        );
      }
    }

  } catch (err) {
    callBack(err, email.messageId);
  }
};

process.on("SIGINT", () => {
  // Perform cleanup tasks here if needed
  process.exit(0); // Exit gracefully
});

AsyncPolling((end) => {
  start(() => {
    for (let name in multiTransporters) {
      try {
        multiTransporters[name].close();
      } catch (err) {
      }
    }
    end();
  });
}, 60000).run();
