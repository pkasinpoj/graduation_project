module.exports =  {
    "type": process.env.DB_TYPE || "",
    "host": process.env.DB_HOST || '',
    "port": process.env.DB_PORT || 3306,
    "username": process.env.DB_USERNAME || '',
    "password": process.env.DB_PASSWORD || '',
    "database": process.env.DB_DATABASE || '',
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
