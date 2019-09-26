const {
    GraphQLInputObjectType,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString
} = require('graphql');
const definePagedListType = require('./pagedList');

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
                type: new GraphQLList(skillType)
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
            return context.services.employees.getAll(args.filter, args.skip, args.first, args.orderBy);
        }
    }
};

module.exports = {
    employeeField,
    employeeType
};