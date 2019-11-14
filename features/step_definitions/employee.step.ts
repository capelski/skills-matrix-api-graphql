import { expect } from 'chai';
import { Then } from 'cucumber';
import { PagedList } from '../../src/context/types';
import { cucumberContext } from './cucumber-context';

Then('I get a total count of {int} employees', (result: number) => {
    cucumberContext.implementations.forEach(implementation => {
        expect(implementation.queryResult.data.employee.totalCount).to.equal(result);
    });
});

Then('I get {int} employees', (result: number) => {
    cucumberContext.implementations.forEach(implementation => {
        expect(implementation.queryResult.data.employee.items.length).to.equal(result);
    });
});

Then(
    'the employee {int} in the response is {string}',
    (employeeNumber: number, employeeName: string) => {
        cucumberContext.implementations.forEach(implementation => {
            const employee = implementation.queryResult.data.employee.items[employeeNumber - 1];
            expect(employee.name).to.equal(employeeName);
        });
    }
);

Then(
    'the skills total count of the employee {int} in the response is {int}',
    (employeeNumber: number, skillsTotalCount: number) => {
        cucumberContext.implementations.forEach(implementation => {
            const employee = implementation.queryResult.data.employee.items[employeeNumber - 1];
            const skillsCount = employee.skills.totalCount;
            expect(skillsCount).to.equal(skillsTotalCount);
        });
    }
);

Then(
    'the employee {int} in the response has {int} skills',
    (employeeNumber: number, skillsLength: string) => {
        cucumberContext.implementations.forEach(implementation => {
            const employee = implementation.queryResult.data.employee.items[employeeNumber - 1];
            expect(employee.skills.items.length).to.equal(skillsLength);
        });
    }
);

Then(
    'the skill {int} of the employee {int} in the response is {string}',
    (skillNumber: number, employeeNumber: number, skillName: string) => {
        cucumberContext.implementations.forEach(implementation => {
            const employee = implementation.queryResult.data.employee.items[employeeNumber - 1];
            const skill = employee.skills.items[skillNumber - 1];
            expect(skill.name).to.equal(skillName);
        });
    }
);

Then('the total number of employees in the system is {int}', (result: number) => {
    cucumberContext.implementations.forEach(implementation => {
        implementation
            .context!.employees.getAll()
            .then((employees: PagedList<any>) => {
                expect(employees.totalCount).to.equal(result);
            })
            .catch(error => {
                throw error;
            });
    });
});

Then('the added employee name is {string}', (employeeName: string) => {
    cucumberContext.implementations.forEach(implementation => {
        const employee = implementation.queryResult.data.addEmployee;
        expect(employee.name).to.equal(employeeName);
    });
});

Then('the added employee id is {int}', (employeeId: number) => {
    cucumberContext.implementations.forEach(implementation => {
        const employee = implementation.queryResult.data.addEmployee;
        expect(employee.id).to.equal(employeeId);
    });
});

Then('the added employee has {int} skills', (skillsLength: number) => {
    cucumberContext.implementations.forEach(implementation => {
        const employee = implementation.queryResult.data.addEmployee;
        expect(employee.skills.items.length).to.equal(skillsLength);
    });
});

Then('the removed employee name is {string}', (employeeName: string) => {
    cucumberContext.implementations.forEach(implementation => {
        const employee = implementation.queryResult.data.removeEmployee;
        expect(employee.name).to.equal(employeeName);
    });
});

Then('the updated employee name is {string}', (employeeName: string) => {
    cucumberContext.implementations.forEach(implementation => {
        const employee = implementation.queryResult.data.updateEmployee;
        expect(employee.name).to.equal(employeeName);
    });
});

Then('the updated employee has {int} skills', (skillsLength: number) => {
    cucumberContext.implementations.forEach(implementation => {
        const employee = implementation.queryResult.data.updateEmployee;
        expect(employee.skills.items.length).to.equal(skillsLength);
    });
});
