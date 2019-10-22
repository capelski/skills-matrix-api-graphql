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
            // TODO Define as the type in skill.js
            skills: {
                type: definePagedListType(skillType, 'EmployeeSkillsPagedList'),
                args: {
                    filter: { type: employeeSkillFilterType },
                    first: { type: GraphQLInt },
                    skip: { type: GraphQLInt },
                    orderBy: { type: employeeSkillOrderByType }
                },
                resolve: (object, args, context) => {
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
    description: 'Employees',
    args: {
        filter: { type: employeeFilterType },
        first: { type: GraphQLInt },
        skip: { type: GraphQLInt },
        orderBy: { type: employeeOrderByType }
    },
    resolve: (object, args, context) => {
        if (args.filter && args.filter.id) {
            return context.employees.getById(args.filter.id).then(employee => ({
                items: [employee],
                totalCount: 1
            }));
        } else {
            return context.employees.getAll(args.skip, args.first, args.filter, args.orderBy);
        }
    }
};

const employeeInputType = new GraphQLInputObjectType({
    name: 'EmployeeInput',
    fields: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        skillsId: { type: new GraphQLList(GraphQLInt) }
    }
});

const addEmployee = {
    type: employeeType,
    args: {
        input: { type: employeeInputType }
    },
    resolve: function (object, args, context) {
        return context.employees.create(args.input);
    }
};

module.exports = {
    employeeMutations: {
        add: addEmployee
    },
    employeeQueryField,
    employeeType
};