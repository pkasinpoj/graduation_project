module.exports =  {
    "type": process.env.DB_TYPE || "mysql",
    "host": process.env.DB_HOST || 'us-cdbr-east-02.cleardb.com',
    "port": process.env.DB_PORT || 3306,
    "username": process.env.DB_USERNAME || 'bc3b2406c74d3f',
    "password": process.env.DB_PASSWORD || 'f8c85c98',
    "database": process.env.DB_DATABASE || 'heroku_5c69103da6c13f1',
    "synchronize": true,
    "logging": false,
    "entities": [
        "src/entity/**/*.ts"
    ],
    "migrations": [
        "src/migration/**/*.ts"
    ],
    "subscribers": [
        "src/subscriber/**/*.ts"
    ],
    "cli": {
        "entitiesDir": "src/entity",
        "migrationsDir": "src/migration",
        "subscribersDir": "src/subscriber"
    }
};
