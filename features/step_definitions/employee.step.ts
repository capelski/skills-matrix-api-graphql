import { expect } from 'chai';
import { Then } from 'cucumber';
import { cucumberContext } from './cucumber-context';

Then('I get a total count of {int} employees', result => {
    expect(cucumberContext.queryResult.data.employee.totalCount).to.equal(result);
});

Then('I get {int} employees', result => {
    expect(cucumberContext.queryResult.data.employee.items.length).to.equal(result);
});

Then('the employee {int} in the response is {string}', (employeeNumber, employeeName) => {
    const employee = cucumberContext.queryResult.data.employee.items[employeeNumber - 1];
    expect(employee.name).to.equal(employeeName);
});

Then(
    'the skills total count of the employee {int} in the response is {int}',
    (employeeNumber, skillsTotalCount) => {
        const employee = cucumberContext.queryResult.data.employee.items[employeeNumber - 1];
        const skillsCount = employee.skills.totalCount;
        expect(skillsCount).to.equal(skillsTotalCount);
    }
);

Then('the employee {int} in the response has {int} skills', (employeeNumber, skillsLength) => {
    const employee = cucumberContext.queryResult.data.employee.items[employeeNumber - 1];
    expect(employee.skills.items.length).to.equal(skillsLength);
});

Then(
    'the skill {int} of the employee {int} in the response is {string}',
    (skillNumber, employeeNumber, skillName) => {
        const employee = cucumberContext.queryResult.data.employee.items[employeeNumber - 1];
        const skill = employee.skills.items[skillNumber - 1];
        expect(skill.name).to.equal(skillName);
    }
);

Then('the total number of employees in the system is {int}', result => {
    // TODO Remove any cast
    cucumberContext.context!.employees.getAll().then((employees: any) => {
        expect(employees.totalCount).to.equal(result);
    });
});

Then('the added employee name is {string}', employeeName => {
    const employee = cucumberContext.queryResult.data.addEmployee;
    expect(employee.name).to.equal(employeeName);
});

Then('the added employee id is {int}', employeeId => {
    const employee = cucumberContext.queryResult.data.addEmployee;
    expect(employee.id).to.equal(employeeId);
});

Then('the added employee has {int} skills', skillsLength => {
    const employee = cucumberContext.queryResult.data.addEmployee;
    expect(employee.skills.items.length).to.equal(skillsLength);
});

Then('the removed employee name is {string}', employeeName => {
    const employee = cucumberContext.queryResult.data.removeEmployee;
    expect(employee.name).to.equal(employeeName);
});

Then('the updated employee name is {string}', employeeName => {
    const employee = cucumberContext.queryResult.data.updateEmployee;
    expect(employee.name).to.equal(employeeName);
});

Then('the updated employee has {int} skills', skillsLength => {
    const employee = cucumberContext.queryResult.data.updateEmployee;
    expect(employee.skills.items.length).to.equal(skillsLength);
});
