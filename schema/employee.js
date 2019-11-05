const {
    GraphQLInputObjectType,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString
} = require('graphql');
const definePagedListType = require('./paged-list');

const employeeType = new GraphQLObjectType({
    name: 'Employee',
    fields: () => {
        const { skillType } = require('./skill');
        return {
            id: {
                type: GraphQLInt,
            },
            name: {
                type: new GraphQLNonNull(GraphQLString),
            },
            skills: {
                type: definePagedListType(skillType, 'EmployeeSkillsPagedList'),
                args: {
                    filter: { type: employeeSkillFilterType },
                    first: { type: GraphQLInt },
                    skip: { type: GraphQLInt },
                    orderBy: { type: employeeSkillOrderByType }
                },
                resolve: (object, args, context) => {
                    context.ensurePermission(context.user, 'employees:read');
                    return context.employees.getEmployeeSkills(object.id, args.filter, args.skip, args.first, args.orderBy);
                }
            }
        };
    }
});

const employeeFilterType = new GraphQLInputObjectType({
    name: 'EmployeeFilter',
    fields: {
        id: {
            type: GraphQLInt
        },
        name: {
            type: GraphQLString
        }
    }
});

const employeeSkillFilterType = new GraphQLInputObjectType({
    name: 'EmployeeSkillFilter',
    fields: {
        name: {
            type: GraphQLString
        }
    }
});

const employeeOrderByType = new GraphQLInputObjectType({
    name: 'EmployeeOrderBy',
    fields: {
        name: {
            type: GraphQLInt
        },
        skills: {
            type: GraphQLInt
        }
    }
});

const employeeSkillOrderByType = new GraphQLInputObjectType({
    name: 'EmployeeSkillOrderBy',
    fields: {
        name: {
            type: GraphQLInt
        }
    }
});

const employeeQueryField = {
    type: definePagedListType(employeeType),
    description: 'Returns the available employees',
    args: {
        filter: { type: employeeFilterType },
        first: { type: GraphQLInt },
        skip: { type: GraphQLInt },
        orderBy: { type: employeeOrderByType }
    },
    resolve: (object, args, context) => {
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
    }
};

const addEmployeeInputType = new GraphQLInputObjectType({
    name: 'AddEmployeeInput',
    fields: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        skillsId: { type: new GraphQLList(GraphQLInt) }
    }
});

const addEmployee = {
    type: employeeType,
    description: 'Creates a new employee with the given name and skills',
    args: {
        input: { type: addEmployeeInputType }
    },
    resolve: function (object, args, context) {
        context.ensurePermission(context.user, 'employees:create');
        return context.employees.create(args.input);
    }
};

const removeEmployee = {
    type: employeeType,
    description: 'Removes the employee identified by the input id',
    args: {
        input: { type: new GraphQLNonNull(GraphQLInt) }
    },
    resolve: function (object, args, context) {
        context.ensurePermission(context.user, 'employees:delete');
        return context.employees.remove(args.input);
    }
};

const updateEmployeeInputType = new GraphQLInputObjectType({
    name: 'UpdateEmployeeInput',
    fields: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLString },
        skillsId: { type: new GraphQLList(GraphQLInt) }
    }
});

const updateEmployee = {
    type: employeeType,
    description: 'Updates the name and skills of the employee identified by id',
    args: {
        input: { type: updateEmployeeInputType }
    },
    resolve: function (object, args, context) {
        context.ensurePermission(context.user, 'employees:update');
        return context.employees.update(args.input);
    }
};

module.exports = {
    employeeMutations: {
        add: addEmployee,
        remove: removeEmployee,
        update: updateEmployee
    },
    employeeQueryField,
    employeeType
};