const { Given, When } = require('cucumber');
const { graphql } = require('graphql');
const shared = require('./shared');

Given('the defined GraphQL schema', () => {
    shared.schema = require('../../schema');
});

Given('the in-memory repositories', () => {
    const repositories = require('../../repositories/in-memory')();
    shared.context = require('../../context')(repositories);
});

When(/I perform the query$/, async (query) => {
    shared.queryResult = await graphql(shared.schema, query, undefined, shared.context);
});
