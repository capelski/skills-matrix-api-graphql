export interface Configuration {
    DB_HOST: string;
    DB_NAME: string;
    DB_PASSWORD: string;
    DB_PORT: number;
    DB_USER: string;
    JWT_SECRET: string;
    LOG_SQL_QUERIES: boolean;
    USE_DATABASE: boolean;
}

const defaultConfig: Configuration = {
    DB_HOST: 'localhost',
    DB_NAME: 'skills-matrix',
    DB_PASSWORD: 'admin',
    DB_PORT: 5432,
    DB_USER: 'postgres',
    JWT_SECRET:
        'In 1889 at age 44, he suffered a collapse and afterward a complete loss of his mental faculties',
    LOG_SQL_QUERIES: false,
    USE_DATABASE: true
};

export const getConfiguration = (
    environmentConfig: Partial<Configuration> = {}
): Configuration => ({
    DB_HOST:
        environmentConfig.DB_HOST !== undefined ? environmentConfig.DB_HOST : defaultConfig.DB_HOST,
    DB_NAME:
        environmentConfig.DB_NAME !== undefined ? environmentConfig.DB_NAME : defaultConfig.DB_NAME,
    DB_PASSWORD:
        environmentConfig.DB_PASSWORD !== undefined
            ? environmentConfig.DB_PASSWORD
            : defaultConfig.DB_PASSWORD,
    DB_PORT:
        environmentConfig.DB_PORT !== undefined ? environmentConfig.DB_PORT : defaultConfig.DB_PORT,
    DB_USER:
        environmentConfig.DB_USER !== undefined ? environmentConfig.DB_USER : defaultConfig.DB_USER,
    JWT_SECRET:
        environmentConfig.JWT_SECRET !== undefined
            ? environmentConfig.JWT_SECRET
            : defaultConfig.JWT_SECRET,
    LOG_SQL_QUERIES:
        environmentConfig.LOG_SQL_QUERIES !== undefined
            ? environmentConfig.LOG_SQL_QUERIES
            : defaultConfig.LOG_SQL_QUERIES,
    USE_DATABASE:
        environmentConfig.USE_DATABASE !== undefined
            ? environmentConfig.USE_DATABASE
            : defaultConfig.USE_DATABASE
});
