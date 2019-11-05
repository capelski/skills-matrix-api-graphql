const employeesService = require('./employees-service');
const skillsService = require('./skills-service');

const ensurePermission = (user, permission) => { 
    const hasPermission = user && user.permissions && user.permissions.indexOf(permission) > -1;
    if (!hasPermission) {
        // For security reasons, the actual error message would not reveal the required permission
        throw new Error(`Unauthorized! You must be granted ${permission}`)
    }
};

const contextFactory = (repositories) => ({
    employees: employeesService(repositories),
    ensurePermission,
    skills: skillsService(repositories)
});

module.exports = contextFactory;