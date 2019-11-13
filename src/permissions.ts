export interface User {
    id: string;
    permissions: string[];
}

export const employeePermissions = [
    'employees:read',
    'employees:create',
    'employees:delete',
    'employees:update'
];
export const skillPermissions = ['skills:read', 'skills:create', 'skills:delete', 'skills:update'];
export const allPermissions = employeePermissions.concat(skillPermissions);

export interface Permissions {
    employees: string[];
    all: string[];
    skills: string[];
}

const permissions: Permissions = {
    employees: employeePermissions,
    all: allPermissions,
    skills: skillPermissions
};

export default permissions;
