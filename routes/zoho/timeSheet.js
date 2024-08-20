var express = require("express");
var router = express.Router();
const axios = require("axios");
const defaultConfig = require("../../defaults");
const { processTimeLogs } = require("../../utils");
const { errorResponseHandler } = require("../../commonFunc");

const timeLogRequestHandler = async (url, index = 1, data = []) => {
  const headers = {
    Authorization: `Bearer ${process.env.ZOHO_ACCESS_TOKEN}`,
    "content-type": "application/json",
  };

  const link = `${url}&index=${index}&range=200`;

  const request = await axios
    .get(link, {
      headers,
    })
    .then((response) => {
      const log = response.data.timelogs;
      if (log !== null && log !== undefined) {
        const timeLogs = log.date;
        data = data.concat(timeLogs);
        return timeLogRequestHandler(url, index + 200, data);
      } else {
        return data;
      }
    })
    .catch(async (error) => {
      errorResponseHandler(error);
    });
  return request;
};

router.get("/logs", async (req, res) => {
  const { projectID, view_type, date } = req.query;
  const url = `https://projectsapi.zoho.in/restapi/portal/${defaultConfig.live.portalID}/projects/${projectID}/logs/?users_list=all&view_type=${view_type}&date=${date}&bill_status=All&component_type=task`;

  const response = await timeLogRequestHandler(url);
  const result = processTimeLogs(response);
  res.send(result);
});

module.exports = router;
