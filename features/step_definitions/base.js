const { expect } = require('chai');
const { Given, When, Then } = require('cucumber');
const { graphql } = require('graphql');

let schema;
let context;
let queryResult;

Given('the defined GraphQL schema', () => {
    schema = require('../../schema');
});

Given('the in-memory repositories', () => {
    const repositories = require('../../repositories/in-memory');
    context = require('../../context')(repositories);
});

When(/I perform the query$/, async (query) => {
    queryResult = await graphql(schema, query, undefined, context);
});

Then('I should get a total count of {int} employees', (result) => {
    expect(queryResult.data.employee.totalCount).to.equal(result);
});

Then('I should get a total count of {int} skills', (result) => {
    expect(queryResult.data.skill.totalCount).to.equal(result);
});

Then('I should get {int} employees', (result) => {
    expect(queryResult.data.employee.items.length).to.equal(result);
});

Then('I should get {int} skills', (result) => {
    expect(queryResult.data.skill.items.length).to.equal(result);
});

Then('the employee {int} in the response should be {string}', (employeeNumber, employeeName) => {
    const employee = queryResult.data.employee.items[employeeNumber - 1];
    expect(employee.name).to.equal(employeeName);
});

Then('the skill {int} in the response should be {string}', (skillNumber, skillName) => {
    const skill = queryResult.data.skill.items[skillNumber - 1];
    expect(skill.name).to.equal(skillName);
});
