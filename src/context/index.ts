import { User } from '../permissions';
import { Repositories } from '../repositories/types';
import employeesResolver from './employees-resolver';
import skillsResolver from './skills-resolver';
import { AppContext } from './types';

const ensurePermission = (user: User, permission: string) => {
    const hasPermission = user && user.permissions && user.permissions.indexOf(permission) > -1;
    if (!hasPermission) {
        // For security reasons, the actual error message would not reveal the required permission
        throw new Error(`Unauthorized! You must be granted ${permission}`);
    }
};

export const contextFactory = (repositories: Repositories, user: User): AppContext => ({
    employees: employeesResolver(repositories),
    ensurePermission,
    skills: skillsResolver(repositories),
    user
});
