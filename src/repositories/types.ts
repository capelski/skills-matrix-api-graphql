import { Client, QueryResult } from 'pg';

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
    getAll: (
        skip?: number,
        first?: number,
        filter?: EmployeeFilter,
        orderBy?: EmployeeOrderBy
    ) => Promise<Employee[]>;
    getById: (id: number) => Promise<Employee | undefined>;
    remove: (id: number) => Promise<Employee | undefined>;
    update: (id: number, name: string) => Promise<Employee | undefined>;
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
    getAll: (
        skip?: number,
        first?: number,
        filter?: SkillFilter,
        orderBy?: SkillOrderBy
    ) => Promise<Skill[]>;
    getById: (id: number) => Promise<Skill | undefined>;
    remove: (id: number) => Promise<Skill | undefined>;
    update: (id: number, name: string) => Promise<Skill | undefined>;
}

export interface EmployeeSkill {
    employeeId: number;
    skillId: number;
}

export interface EmployeesSkillsRepository {
    add: (employeeSkill: EmployeeSkill) => Promise<EmployeeSkill>;
    countByEmployeeId: (employeeId: number, filter?: EmployeeFilter) => Promise<number>;
    countBySkillId: (skillId: number, filter?: SkillFilter) => Promise<number>;
    getByEmployeeId: (
        employeeId: number,
        skip: number,
        first: number,
        filter?: SkillFilter,
        orderBy?: SkillOrderBy
    ) => Promise<Skill[]>;
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
    employeesSkills: EmployeesSkillsRepository;
    skills: SkillsRepository;
}

export type RepositoriesSet =
    | { type: 'built'; set: Repositories }
    | { type: 'non-built'; set: SqlRepositoriesBuilders; client: Client };

export type SqlQueryResolver = (
    sql: string,
    parameters?: Array<number | string>
) => Promise<QueryResult<any>>;

export interface SqlRepositoriesBuilders {
    employees: (sqlQueryResolver: SqlQueryResolver) => EmployeesRepository;
    employeesSkills: (sqlQueryResolver: SqlQueryResolver) => EmployeesSkillsRepository;
    skills: (sqlQueryResolver: SqlQueryResolver) => SkillsRepository;
}
