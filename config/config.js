exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                       (process.env.NODE_ENV === 'production' ?
                            'mongodb://localhost/current-c-app' :
                            'mongodb://localhost/current-c-app-dev');
exports.PORT = process.env.PORT || 8080;
