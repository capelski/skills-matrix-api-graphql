const {
    GraphQLInputObjectType,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString
} = require('graphql');
const definePagedListType = require('./pagedList');

const skillType = new GraphQLObjectType({
    name: 'Skill',
    fields: () => {
        const { employeeType } = require('./employee');
        return {
            employees: {
                type: new GraphQLList(employeeType)
            },
            id: {
                type: GraphQLInt,
            },
            name: {
                type: new GraphQLNonNull(GraphQLString),
            }
        };
    }
});

const skillFilterType = new GraphQLInputObjectType({
    name: 'SkillFilter',
    fields: {
        id: {
            type: GraphQLInt
        },
        name: {
            type: GraphQLString
        }
    }
});

const skillOrderByType = new GraphQLInputObjectType({
    name: 'SkillOrderBy',
    fields: {
        employees: {
            type: GraphQLInt
        },
        name: {
            type: GraphQLInt
        }
    }
});

const skillField = {
    type: definePagedListType(skillType),
    description: 'Skills',
    args: {
        filter: { type: skillFilterType },
        first: { type: GraphQLInt },
        skip: { type: GraphQLInt },
        orderBy: { type: skillOrderByType }
    },
    resolve: (object, args, context) => {
        if (args.filter && args.filter.id) {
            return context.services.skills.getById(args.filter.id).then(skill => ({
                items: [skill],
                totalCount: 1,
            }));
        } else {
            return context.services.skills.getAll(args.filter, args.skip, args.first, args.orderBy);
        }
    }
}

module.exports = {
    skillField,
    skillType
};