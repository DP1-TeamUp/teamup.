const config = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'YOUR_secret_key',
  mongoUri:
    'mongodb+srv://IBTID:IBTID31@cluster0.6asbl.mongodb.net/teamUp?retryWrites=true&w=majority',
};

module.exports = config;
