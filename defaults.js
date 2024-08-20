// Default configuration settings
const defaultConfig = {
  port: process.env.PORT || 3000,

  // Sandbox Account
  sandbox: {
    portalID: "60009030034",
    projectID: "79545000001597041",
  },
  live: {
    portalID: "60006937385",
  },
};

module.exports = defaultConfig;
