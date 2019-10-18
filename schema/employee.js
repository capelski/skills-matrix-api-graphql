const {
    GraphQLInputObjectType,
    GraphQLInt,
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
                // TODO Provide types for filtering and orderBy
                args: {
                    // filter: { type: skillFilterType },
                    first: { type: GraphQLInt },
                    skip: { type: GraphQLInt },
                    // orderBy: { type: skillOrderByType }
                },
                resolve: (object, args, context) => {
                    console.log('Resolving', object.id, args)
                    return context.services.employees.getEmployeeSkills(object.id, args.filter, args.skip, args.first, args.orderBy);
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

const employeeField = {
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
            return context.services.employees.getById(args.filter.id).then(employee => ({
                items: [employee],
                totalCount: 1
            }));
        } else {
            return context.services.employees.getAll(args.skip, args.first, args.filter, args.orderBy);
        }
    }
};

module.exports = {
    employeeField,
    employeeType
};