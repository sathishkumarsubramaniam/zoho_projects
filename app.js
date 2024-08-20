require("dotenv").config();
const express = require("express");
const defaultConfig = require("./defaults");
const { regenerateZohoAccessToken } = require("./commonFunc");
var timeSheetRouter = require("./routes/zoho/timeSheet");
// var projectsRouter = require("./routes/zoho/projects");

const app = express();

app.set("port", defaultConfig.port);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/timeSheet", timeSheetRouter);
// app.use("/projects", projectsRouter);

const PORT = app.get("port");
app.listen(PORT, async () => {
  console.log(`Server Started -  http://localhost:${PORT}`);
  console.log("Generating Access Token");

  const intervalInMinutes = 58;
  const intervalInMilliseconds = intervalInMinutes * 60 * 1000;

  setInterval(regenerateZohoAccessToken, intervalInMilliseconds);

  await regenerateZohoAccessToken();
});
