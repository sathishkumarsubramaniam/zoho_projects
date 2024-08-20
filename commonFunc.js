const axios = require("axios");

const exportVar = (name, value) => {
  process.env[name] = value;
};

async function regenerateZohoAccessToken() {
  const url = `${process.env.ZOHO_OAUTH_BASEURL}?refresh_token=${process.env.ZOHO_REFRESH_TOKEN}&client_id=${process.env.ZOHO_CLIENT_ID}&client_secret=${process.env.ZOHO_CLIENT_SECRET}&grant_type=refresh_token`;
  await axios
    .post(url)
    .then((response) => {
      if (response.data !== null && response.data !== undefined) {
        exportVar("ZOHO_ACCESS_TOKEN", response.data.access_token);
        exportVar("ZOHO_API_DOMAIN", response.data.api_domain);
      }
    })
    .catch((error) => console.log(error));
  console.log("New Access Token Generated", process.env.ZOHO_ACCESS_TOKEN);
}

async function errorResponseHandler(error) {
  console.log(error.response);
  if (
    error.response &&
    error.response.status === 401 &&
    error.response.data.error.code === 6401
  ) {
    console.log(error.response.data);
    await regenerateZohoAccessToken();
  }
}

module.exports = {
  regenerateZohoAccessToken,
  errorResponseHandler,
};
