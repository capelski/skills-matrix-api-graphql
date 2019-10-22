const {
    GraphQLInputObjectType,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString
} = require('graphql');
const definePagedListType = require('./paged-list');

const skillType = new GraphQLObjectType({
    name: 'Skill',
    fields: () => {
        const { employeeType } = require('./employee');
        return {
            // TODO Define as the type in employee.js
            employees: {
                type: definePagedListType(employeeType, 'SkillEmployeesPagedList'),
                args: {
                    filter: { type: skillEmployeeFilterType },
                    first: { type: GraphQLInt },
                    skip: { type: GraphQLInt },
                    orderBy: { type: skillEmployeeOrderByType }
                },
                resolve: (object, args, context) => {
                    return context.skills.getSkillEmployees(object.id, args.filter, args.skip, args.first, args.orderBy);
                }
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

const skillEmployeeFilterType = new GraphQLInputObjectType({
    name: 'SkillEmployeeFilter',
    fields: {
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


const skillEmployeeOrderByType = new GraphQLInputObjectType({
    name: 'SkillEmployeeOrderBy',
    fields: {
        name: {
            type: GraphQLInt
        }
    }
});

const skillQueryField = {
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
            return context.skills.getById(args.filter.id).then(skill => ({
                items: [skill],
                totalCount: 1,
            }));
        } else {
            return context.skills.getAll(args.skip, args.first, args.filter, args.orderBy);
        }
    }
};

const skillInputType = new GraphQLInputObjectType({
    name: 'SkillInput',
    fields: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        employeesId: { type: new GraphQLList(GraphQLInt) }
    }
});

const addSkill = {
    type: skillType,
    args: {
        input: { type: skillInputType }
    },
    resolve: function (object, args, context) {
        return context.skills.create(args.input);
    }
};

module.exports = {
    skillMutations: {
        add: addSkill
    },
    skillQueryField,
    skillType
};