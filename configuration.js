const defaultConfig = {
    DB_HOST: 'localhost',
    DB_NAME: 'skills-matrix',
    DB_PASSWORD: 'admin',
    DB_PORT: 5432,
    DB_USER: 'postgres',
};

const getConfiguration = (environmentConfig = {}) => ({
    DB_HOST: environmentConfig.DB_HOST !== undefined ? environmentConfig.DB_HOST : defaultConfig.DB_HOST,
    DB_NAME: environmentConfig.DB_NAME !== undefined ? environmentConfig.DB_NAME : defaultConfig.DB_NAME,
    DB_PASSWORD: environmentConfig.DB_PASSWORD !== undefined ? environmentConfig.DB_PASSWORD : defaultConfig.DB_PASSWORD,
    DB_PORT: environmentConfig.DB_PORT !== undefined ? environmentConfig.DB_PORT : defaultConfig.DB_PORT,
    DB_USER: environmentConfig.DB_USER !== undefined ? environmentConfig.DB_USER : defaultConfig.DB_USER,
});

module.exports = getConfiguration;