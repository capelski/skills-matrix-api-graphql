import { expect } from 'chai';
import { Then } from 'cucumber';
import { PagedList } from '../../src/context/types';
import { cucumberContext } from './cucumber-context';

Then('I get a total count of {int} skills', (result: number) => {
    cucumberContext.implementations.forEach(implementation => {
        expect(implementation.queryResult.data.skill.totalCount).to.equal(result);
    });
});

Then('I get {int} skills', (result: number) => {
    cucumberContext.implementations.forEach(implementation => {
        expect(implementation.queryResult.data.skill.items.length).to.equal(result);
    });
});

Then('the skill {int} in the response is {string}', (skillNumber: number, skillName: string) => {
    cucumberContext.implementations.forEach(implementation => {
        const skill = implementation.queryResult.data.skill.items[skillNumber - 1];
        expect(skill.name).to.equal(skillName);
    });
});

Then(
    'the employees total count of the skill {int} in the response is {int}',
    (skillNumber: number, employeesTotalCount: number) => {
        cucumberContext.implementations.forEach(implementation => {
            const skill = implementation.queryResult.data.skill.items[skillNumber - 1];
            const employeesCount = skill.employees.totalCount;
            expect(employeesCount).to.equal(employeesTotalCount);
        });
    }
);

Then(
    'the skill {int} in the response has {int} employees',
    (skillNumber: number, employeesLength: number) => {
        cucumberContext.implementations.forEach(implementation => {
            const skill = implementation.queryResult.data.skill.items[skillNumber - 1];
            expect(skill.employees.items.length).to.equal(employeesLength);
        });
    }
);

Then(
    'the employee {int} of the skill {int} in the response is {string}',
    (employeeNumber: number, skillNumber: number, employeeName: string) => {
        cucumberContext.implementations.forEach(implementation => {
            const skill = implementation.queryResult.data.skill.items[skillNumber - 1];
            const employee = skill.employees.items[employeeNumber - 1];
            expect(employee.name).to.equal(employeeName);
        });
    }
);

Then('the total number of skills in the system is {int}', (result: number) => {
    cucumberContext.implementations.forEach(implementation => {
        implementation.context!.skills.getAll().then((skills: PagedList<any>) => {
            expect(skills.totalCount).to.equal(result);
        });
    });
});

Then('the added skill name is {string}', (skillName: string) => {
    cucumberContext.implementations.forEach(implementation => {
        const skill = implementation.queryResult.data.addSkill;
        expect(skill.name).to.equal(skillName);
    });
});

Then('the added skill id is {int}', (skillId: number) => {
    cucumberContext.implementations.forEach(implementation => {
        const skill = implementation.queryResult.data.addSkill;
        expect(skill.id).to.equal(skillId);
    });
});

Then('the added skill has {int} employees', (employeesLength: number) => {
    cucumberContext.implementations.forEach(implementation => {
        const skill = implementation.queryResult.data.addSkill;
        expect(skill.employees.items.length).to.equal(employeesLength);
    });
});

Then('the removed skill name is {string}', (skillName: string) => {
    cucumberContext.implementations.forEach(implementation => {
        const skill = implementation.queryResult.data.removeSkill;
        expect(skill.name).to.equal(skillName);
    });
});

Then('the updated skill name is {string}', (skillName: string) => {
    cucumberContext.implementations.forEach(implementation => {
        const skill = implementation.queryResult.data.updateSkill;
        expect(skill.name).to.equal(skillName);
    });
});

Then('the updated skill has {int} employees', (employeesLength: number) => {
    cucumberContext.implementations.forEach(implementation => {
        const skill = implementation.queryResult.data.updateSkill;
        expect(skill.employees.items.length).to.equal(employeesLength);
    });
});
