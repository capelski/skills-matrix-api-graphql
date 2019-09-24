const defaultConfig = {
	DATABASE: "db_name_placeholder",
    DB_USER: "db_user_placeholder",
    DB_PASSWORD: "db_password_placeholder"
};

const getConfiguration = (environmentConfig = {}) => ({
    DATABASE: environmentConfig.DATABASE !== undefined ? environmentConfig.DATABASE : defaultConfig.DATABASE,
    DB_USER: environmentConfig.DB_USER !== undefined ? environmentConfig.DB_USER : defaultConfig.DB_USER,
    DB_PASSWORD: environmentConfig.DB_PASSWORD !== undefined ? environmentConfig.DB_PASSWORD : defaultConfig.DB_PASSWORD,
});

module.exports = getConfiguration;