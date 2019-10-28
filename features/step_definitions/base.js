const { Given, When } = require('cucumber');
const { graphql } = require('graphql');
const shared = require('./shared');
const alasql = require('alasql');

Given('the defined GraphQL schema', () => {
    shared.schema = require('../../schema');
});

Given('the in-memory repositories', () => {
    const repositories = require('../../repositories/in-memory')();
    shared.context = require('../../context')(repositories);
});

Given('the postgre repositories', () => {
    const alasqlClient = {
        query: (sql, parameters) => {
            // Alasql doesn't support parametrized queries; we need to replace the values
            sql = parameters.reduce((reduced, next, index) => {
                return reduced.replace(`$${index + 1}`, typeof next === 'string' ? `'${next}'` : next);
            }, sql);

            // We replace the actual database tables with json files
            sql = sql.replace('JOIN employee_skill', 'JOIN json("./repositories/postgre/alasql/employees-skills") as employee_skill')
                .replace('FROM skill', 'FROM json("./repositories/postgre/alasql/skills") as skill')
                .replace('FROM employee', 'FROM json("./repositories/postgre/alasql/employees") as employee');

            // Alasql returns an incorrect data set when ordering by a COUNT() if the COUNT()
            // is not selected
            const hasOrderByCount = sql.match(/ORDER BY COUNT\((.*)\)/);
            if (hasOrderByCount) {
                sql = sql.replace(/SELECT (.*) FROM/, `SELECT $1, COUNT(${hasOrderByCount[1]}) FROM`);
            }

            return alasql.promise(sql)
                .then(rows => {
                    // console.log(sql);
                    // console.log(rows);
                    if (rows[0] && rows[0]['COUNT(*)']) {
                        return {
                            rows: [{
                                count: rows[0]['COUNT(*)']
                            }]
                        };
                    }
                    return {
                        rows
                    };
                })
                .catch((error) => {
                    console.log(sql);
                    console.error(error);
                    throw error;
                });
        }
    };
    const repositories = require('../../repositories/postgre')(alasqlClient);
    shared.context = require('../../context')(repositories);
});

When(/I perform the query$/, async (query) => {
    shared.queryResult = await graphql(shared.schema, query, undefined, shared.context);
});
