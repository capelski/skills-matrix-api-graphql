const employeesService = require('./employees-service');
const skillsService = require('./skills-service');

const ensurePermission = (user, permission) => { 
    const hasPermission = user && user.permissions && user.permissions.indexOf(permission) > -1;
    if (!hasPermission) {
        throw new Error('Unauthorized')
    }
};

const contextFactory = (repositories) => ({
    employees: employeesService(repositories),
    ensurePermission,
    skills: skillsService(repositories)
});

module.exports = contextFactory;