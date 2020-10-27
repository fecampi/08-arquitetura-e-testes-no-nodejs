export default {
  jwt: {
    // http://www.md5.cz/
    secret: process.env.APP_SECRET || 'default',
    expiresIn: '1d',
  },
};
