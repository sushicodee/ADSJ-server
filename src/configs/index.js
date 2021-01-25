module.exports = {
  API: process.env.API_URL,
  JWT_SECRET: process.env.JWT_SECRET || 'nevergiveup',
  PORT: process.env.PORT || 5000,
};
