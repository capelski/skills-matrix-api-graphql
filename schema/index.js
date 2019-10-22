const {
    GraphQLObjectType,
    GraphQLSchema
} = require('graphql');
const { employeeQueryField, employeeMutations } = require('./employee');
const { skillQueryField, skillMutations } = require('./skill');

const rootQueryType = new GraphQLObjectType({
    name: 'RootQuery',
    fields: () => {
        return {
            employee: employeeQueryField,
            skill: skillQueryField
        };
    }
});

const rootMutationType = new GraphQLObjectType({
    name: 'RootMutation',
    fields: {
        addEmployee: employeeMutations.add,
        addSkill: skillMutations.add
    }
});

const schema = new GraphQLSchema({
    query: rootQueryType,
    mutation: rootMutationType,
});

module.exports = schema;