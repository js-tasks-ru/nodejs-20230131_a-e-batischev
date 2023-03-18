module.exports = {
  mongodb: {
    uri: (process.env.NODE_ENV === 'test' ?
      'mongodb://127.0.0.1:27017/test' :
      'mongodb://127.0.0.1:27017/test'),
  },
};
