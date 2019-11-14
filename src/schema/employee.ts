import {
    GraphQLFieldConfig,
    GraphQLInputObjectType,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString
} from 'graphql';
import { AppContext } from '../context/types';
import { definePagedListType } from './paged-list';

export const employeeType = new GraphQLObjectType<any, AppContext>({
    fields() {
        const { skillType } = require('./skill');
        return {
            id: {
                type: GraphQLInt
            },
            name: {
                type: new GraphQLNonNull(GraphQLString)
            },
            skills: {
                args: {
                    filter: { type: employeeSkillFilterType },
                    first: { type: GraphQLInt },
                    orderBy: { type: employeeSkillOrderByType },
                    skip: { type: GraphQLInt }
                },
                resolve: (object, args, context) => {
                    context.ensurePermission(context.user, 'employees:read');
                    return context.employees.getEmployeeSkills(
                        object.id,
                        args.skip,
                        args.first,
                        args.filter,
                        args.orderBy
                    );
                },
                type: definePagedListType(skillType, 'EmployeeSkillsPagedList')
            }
        };
    },
    name: 'Employee'
});

const employeeFilterType = new GraphQLInputObjectType({
    fields: {
        id: {
            type: GraphQLInt
        },
        name: {
            type: GraphQLString
        }
    },
    name: 'EmployeeFilter'
});

const employeeSkillFilterType = new GraphQLInputObjectType({
    fields: {
        name: {
            type: GraphQLString
        }
    },
    name: 'EmployeeSkillFilter'
});

const employeeOrderByType = new GraphQLInputObjectType({
    fields: {
        name: {
            type: GraphQLInt
        },
        skills: {
            type: GraphQLInt
        }
    },
    name: 'EmployeeOrderBy'
});

const employeeSkillOrderByType = new GraphQLInputObjectType({
    fields: {
        name: {
            type: GraphQLInt
        }
    },
    name: 'EmployeeSkillOrderBy'
});

export const employeeQueryField: GraphQLFieldConfig<any, AppContext> = {
    args: {
        filter: { type: employeeFilterType },
        first: { type: GraphQLInt },
        orderBy: { type: employeeOrderByType },
        skip: { type: GraphQLInt }
    },
    description: 'Returns the available employees',
    resolve(object, args, context) {
        if (args.filter && args.filter.id) {
            context.ensurePermission(context.user, 'employees:read');
            return context.employees.getById(args.filter.id).then(employee => ({
                items: [employee],
                totalCount: 1
            }));
        } else {
            context.ensurePermission(context.user, 'employees:read');
            return context.employees.getAll(args.skip, args.first, args.filter, args.orderBy);
        }
    },
    type: definePagedListType(employeeType)
};

const addEmployeeInputType = new GraphQLInputObjectType({
    fields: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        skillsId: { type: new GraphQLList(GraphQLInt) }
    },
    name: 'AddEmployeeInput'
});

const addEmployee: GraphQLFieldConfig<any, AppContext> = {
    args: {
        input: { type: addEmployeeInputType }
    },
    description: 'Creates a new employee with the given name and skills',
    resolve(object, args, context) {
        context.ensurePermission(context.user, 'employees:create');
        return context.employees.create(args.input);
    },
    type: employeeType
};

const removeEmployee: GraphQLFieldConfig<any, AppContext> = {
    args: {
        input: { type: new GraphQLNonNull(GraphQLInt) }
    },
    description: 'Removes the employee identified by the input id',
    resolve(object, args, context) {
        context.ensurePermission(context.user, 'employees:delete');
        return context.employees.remove(args.input);
    },
    type: employeeType
};

const updateEmployeeInputType = new GraphQLInputObjectType({
    fields: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLString },
        skillsId: { type: new GraphQLList(GraphQLInt) }
    },
    name: 'UpdateEmployeeInput'
});

const updateEmployee: GraphQLFieldConfig<any, AppContext> = {
    args: {
        input: { type: updateEmployeeInputType }
    },
    description: 'Updates the name and skills of the employee identified by id',
    resolve(object, args, context) {
        context.ensurePermission(context.user, 'employees:update');
        return context.employees.update(args.input);
    },
    type: employeeType
};

export const employeeMutations = {
    add: addEmployee,
    remove: removeEmployee,
    update: updateEmployee
};
