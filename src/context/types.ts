import { User } from '../permissions';
import {
    Skill,
    SkillFilter,
    SkillOrderBy,
    Employee,
    EmployeeFilter,
    EmployeeOrderBy
} from '../repositories/types';

export interface AppContext {
    employees: EmployeesResolver;
    ensurePermission: (user: User, permission: string) => void;
    skills: SkillsResolver;
    user: User;
}

export interface EmployeeCreateData {
    name: string;
    skillsId: number[];
}

export interface EmployeesResolver {
    create: (employeeData: EmployeeCreateData) => Promise<Employee>;
    getAll: (
        skip?: number,
        first?: number,
        filter?: EmployeeFilter,
        orderBy?: EmployeeOrderBy
    ) => Promise<PagedList<Employee>>;
    getById: (id: number) => Promise<Employee | undefined>;
    getEmployeeSkills: (
        employeeId: number,
        skip: number,
        first: number,
        filter?: EmployeeFilter,
        orderBy?: EmployeeOrderBy
    ) => Promise<PagedList<Employee>>;
    remove: (id: number) => Promise<Employee | undefined>;
    update: (employeeData: EmployeeUpdateData) => Promise<Employee | undefined>;
}

export interface EmployeeUpdateData extends EmployeeCreateData {
    id: number;
}

export interface PagedList<T> {
    items: T[];
    totalCount: number;
}

export interface SkillCreateData {
    name: string;
    employeesId: number[];
}

export interface SkillsResolver {
    create: (skillData: SkillCreateData) => Promise<Skill>;
    getAll: (
        skip?: number,
        first?: number,
        filter?: SkillFilter,
        orderBy?: SkillOrderBy
    ) => Promise<PagedList<Skill>>;
    getById: (id: number) => Promise<Skill | undefined>;
    getSkillEmployees: (
        skillId: number,
        skip: number,
        first: number,
        filter?: SkillFilter,
        orderBy?: SkillOrderBy
    ) => Promise<PagedList<Employee>>;
    remove: (id: number) => Promise<Skill | undefined>;
    update: (skillData: SkillUpdateData) => Promise<Skill | undefined>;
}

export interface SkillUpdateData extends SkillCreateData {
    id: number;
}
