export interface Employee {
    id: number;
    name: string;
}

export interface EmployeeFilter {
    name?: string;
}

export interface EmployeeOrderBy {
    name?: number;
    skills?: number;
}

export interface EmployeesRepository {
    add: (name: string) => Promise<Employee>;
    countAll: (filter?: EmployeeFilter) => Promise<number>;
    // TODO Make all functions take the parameters in the same order
    getAll: (
        skip: number,
        first: number,
        filter?: EmployeeFilter,
        orderBy?: EmployeeOrderBy
    ) => Promise<Employee[]>;
    getById: (id: number) => Promise<Employee>;
    remove: (id: number) => Promise<Employee>;
    update: (id: number, name: string) => Promise<Employee>;
}

export interface Skill {
    id: number;
    name: string;
}

export interface SkillFilter {
    name?: string;
}

export interface SkillOrderBy {
    name?: number;
    employees?: number;
}

export interface SkillsRepository {
    add: (name: string) => Promise<Skill>;
    countAll: (filter?: SkillFilter) => Promise<number>;
    // TODO Make all functions take the parameters in the same order
    getAll: (
        skip: number,
        first: number,
        filter?: SkillFilter,
        orderBy?: SkillOrderBy
    ) => Promise<Skill[]>;
    getById: (id: number) => Promise<Skill>;
    remove: (id: number) => Promise<Skill>;
    update: (id: number, name: string) => Promise<Skill>;
}

export interface EmployeeSkill {
    employeeId: number;
    skillId: number;
}

export interface EmployeesSkillsRepositories {
    add: (employeeSkill: EmployeeSkill) => Promise<EmployeeSkill>;
    countByEmployeeId: (employeeId: number, filter?: EmployeeFilter) => Promise<number>;
    countBySkillId: (skillId: number, filter?: SkillFilter) => Promise<number>;
    // TODO Rename to getSkillsByEmployeeId
    getByEmployeeId: (
        employeeId: number,
        skip: number,
        first: number,
        filter?: SkillFilter,
        orderBy?: SkillOrderBy
    ) => Promise<Skill[]>;
    // TODO Rename to getEmployeesBySkillId. Should be the service actually...
    getBySkillId: (
        skillId: number,
        skip: number,
        first: number,
        filter?: EmployeeFilter,
        orderBy?: EmployeeOrderBy
    ) => Promise<Employee[]>;
    removeByEmployeeId: (employeeId: number) => Promise<EmployeeSkill[]>;
    removeBySkillId: (skillId: number) => Promise<EmployeeSkill[]>;
}

export interface Repositories {
    employees: EmployeesRepository;
    employeesSkills: EmployeesSkillsRepositories;
    skills: SkillsRepository;
}
