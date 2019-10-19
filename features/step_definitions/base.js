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

Then('the name of the employee {int} in the response should be equal to the name of the employee {int} in employees.json', (responseNumber, employeeNumber) => {
    const employees = require('../../repositories/in-memory/data/employees.json');
    const expectedEmployee = employees[employeeNumber - 1];
    const actualEmployee = queryResult.data.employee.items[responseNumber - 1];
    expect(actualEmployee.name).to.equal(expectedEmployee.name);
});

Then('the name of the skill {int} in the response should be equal to the name of the skill {int} in skills.json', (responseNumber, skillNumber) => {
    const skills = require('../../repositories/in-memory/data/skills.json');
    const expectedSkill = skills[skillNumber - 1];
    const actualSkill = queryResult.data.skill.items[responseNumber - 1];
    expect(actualSkill.name).to.equal(expectedSkill.name);
});
