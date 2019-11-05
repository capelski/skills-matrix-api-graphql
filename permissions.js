const employeePermissions = ['employees:read', 'employees:create', 'employees:delete', 'employees:update'];
const skillPermissions = ['skills:read', 'skills:create', 'skills:delete', 'skills:update'];
const allPermissions = employeePermissions.concat(skillPermissions);

module.exports = {
    all: allPermissions,
    employees: employeePermissions,
    skills: skillPermissions
};