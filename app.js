const nodemailer = require("nodemailer");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
require("dotenv").config();
var cors = require("cors");

app.use(cors());

// app.use(function (req, res, next) {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "X-Requested-With,content-type,Accept, Authorization"
//   );
//   res.setHeader("Access-Control-Allow-Credentials", true);
//   next();
// });

app.use(bodyParser.json());

app.post("/sendmail", (req, res) => {
  const { to, subject, body, cc } = req.body;
  const { theClass, className, status, link } = body;
  console.log(req.body, "data of form");
  var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  var mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    cc: cc,
    subject: subject,
    html: htmlTemplateMail(to, theClass, className, status, link),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).json({
        message: "successfuly sent!",
      });
    }
  });
});

app.listen(3000, () => {
  console.log("server run!!!");
});

const templateBody = (to, theClass, className, status, link) => `
Dear ${to.toString()}<br>
${
  !!className ? `Class Name ${className}` : `The Class ${theClass}`
} has been ${status}.<br>
${
  !link
    ? ""
    : `To view the Class details, please click <a href="${link}" target="_blank">here</a>.`
}
<br>
Sincerely,<br>
Application Admin.<br>
<i>Note: This is an auto-generated email, please do not reply.</i>
`;

const htmlTemplateMail = (to, theClass, className, status, link) => `
<div style="margin: 0px auto; max-width: 600px; background-color: #ffffff">
  <table
    align="center"
    border="0"
    cellpadding="0"
    cellspacing="0"
    role="presentation"
    style="width: 100%"
  >
    <tbody>
      <tr>
        <td
          style="
            direction: ltr;
            font-size: 0px;
            padding: 20px 0;
            text-align: center;
          "
        >
          <div
            class="mj-column-per-100 mj-outlook-group-fix"
            style="
              font-size: 0px;
              text-align: left;
              direction: ltr;
              display: inline-block;
              vertical-align: top;
              width: 100%;
            "
          >
            <table
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="vertical-align: top"
              width="100%"
            >
              <tbody>
                <tr>
                  <td
                    align="center"
                    style="
                      font-size: 0px;
                      padding: 8px 0;
                      word-break: break-word;
                    "
                  >
                    <table
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="border-collapse: collapse; border-spacing: 0px; display: flex;"
                    >
                      <tbody>
                        <tr>
                          <td style="width: 150px">
                            <img
                              height="auto"
                              src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/FPT_logo_2010.svg/1200px-FPT_logo_2010.svg.png"
                              style="
                                border: 0;
                                display: block;
                                outline: none;
                                text-decoration: none;
                                height: auto;
                                width: 50%;
                                font-size: 13px;
                                line-height: 100%;
                                -ms-interpolation-mode: bicubic;
                              "
                              width="150"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td
                    style="
                      font-size: 0px;
                      word-break: break-word;
                    "
                  >
                    <p
                      style="
                        border-top: dashed 1px lightgrey;
                        font-size: 1px;
                        margin: 0px auto;
                        width: 100%;
                        display: block;
                        margin: 13px 0;
                      "
                    ></p>
                  </td>
                </tr>
                <tr>
                  <td
                    align="left"
                    style="
                      font-size: 0px;
                      padding: 10px 25px;
                      word-break: break-word;
                      padding-left: 0;
                    "
                  >
                    <div
                      style="
                        font-family: Roboto, Helvetica, Arial, sans-serif;
                        font-size: 24px;
                        font-weight: 300;
                        line-height: 30px;
                        text-align: left;
                        color: #000000;
                      "
                    >
                      Dear ${to.toString()}.
                    </div>
                  </td>
                </tr>
                <tr>
                  <td
                    align="left"
                    style="
                      font-size: 0px;
                      padding: 10px 25px;
                      word-break: break-word;
                      padding-left: 0;
                    "
                  >
                    <div
                      style="
                        font-family: Roboto, Helvetica, Arial, sans-serif;
                        font-size: 14px;
                        font-weight: 300;
                        line-height: 20px;
                        text-align: left;
                        color: #000000;
                      "
                    >
                      ${templateBody(to, theClass, className, status, link)}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>`;
