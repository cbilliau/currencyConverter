exports.DATABASE_URL = process.env.MONGOLAB_URI || 'mongodb://localhost/current-c';
                      //  global.DATABASE_URL ||
                      //  (process.env.NODE_ENV === 'production' ?
                      //       'mongodb://localhost/current-c' :
                      //       'mongodb://localhost/current-c-dev');

exports.PORT = process.env.PORT || 8080;
