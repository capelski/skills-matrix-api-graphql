const { expect } = require('chai');
const { Then } = require('cucumber');
const shared = require('./shared');

Then('I should get a total count of {int} skills', (result) => {
    expect(shared.queryResult.data.skill.totalCount).to.equal(result);
});

Then('I should get {int} skills', (result) => {
    expect(shared.queryResult.data.skill.items.length).to.equal(result);
});

Then('the skill {int} in the response should be {string}', (skillNumber, skillName) => {
    const skill = shared.queryResult.data.skill.items[skillNumber - 1];
    expect(skill.name).to.equal(skillName);
});

Then('the employees total count of the skill {int} in the response should be {int}', (skillNumber, employeesTotalCount) => {
    const skill = shared.queryResult.data.skill.items[skillNumber - 1];
    const employeesCount = skill.employees.totalCount;
    expect(employeesCount).to.equal(employeesTotalCount);
});

Then('the skill {int} in the response should have {int} employees', (skillNumber, employeesLength) => {
    const skill = shared.queryResult.data.skill.items[skillNumber - 1];
    expect(skill.employees.items.length).to.equal(employeesLength);
});

Then('the employee {int} of the skill {int} in the response should be {string}', (employeeNumber, skillNumber, employeeName) => {
    const skill = shared.queryResult.data.skill.items[skillNumber - 1];
    const employee = skill.employees.items[employeeNumber - 1];
    expect(employee.name).to.equal(employeeName);
});

Then('the total number of skills in the system is {int}', (result) => {
    shared.context.skills.getAll().then(skills => {
        expect(skills.totalCount).to.equal(result);
    });
});

Then('the added skill name is {string}', (skillName) => {
    const skill = shared.queryResult.data.addSkill;
    expect(skill.name).to.equal(skillName);
});

Then('the added skill id is {int}', (skillId) => {
    const skill = shared.queryResult.data.addSkill;
    expect(skill.id).to.equal(skillId);
});

Then('the added skill has {int} employees', (employeesLength) => {
    const skill = shared.queryResult.data.addSkill;
    expect(skill.employees.items.length).to.equal(employeesLength);
});

Then('the removed skill name is {string}', (skillName) => {
    const skill = shared.queryResult.data.removeSkill;
    expect(skill.name).to.equal(skillName);
});

Then('the updated skill name is {string}', (skillName) => {
    const skill = shared.queryResult.data.updateSkill;
    expect(skill.name).to.equal(skillName);
});

Then('the updated skill has {int} employees', (employeesLength) => {
    const skill = shared.queryResult.data.updateSkill;
    expect(skill.employees.items.length).to.equal(employeesLength);
});
