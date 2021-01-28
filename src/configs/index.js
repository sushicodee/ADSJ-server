module.exports = {
  API: process.env.API_URL,
  JWT_SECRET: process.env.JWT_SECRET || 'accesstokensecret12345',
  JWT_SECRET_REFRESH:
    process.env.JWT_SECRET_REFRESH || 'refreshtokensecret12345',
  JWT_SECRET_ACTIVATION:
    process.env.JWT_SECRET_ACTIVATION || 'activationtokensecret12345',
  PORT: process.env.PORT || 5000,
};
