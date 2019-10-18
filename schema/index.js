const {
    GraphQLObjectType,
    GraphQLSchema
} = require('graphql');
const { employeeField } = require('./employee');
const { skillField } = require('./skill');

const rootQueryType = new GraphQLObjectType({
    name: 'RootQuery',
    fields: () => {
        return {
            employee: employeeField,
            skill: skillField
        };
    }
});

const schema = new GraphQLSchema({
    query: rootQueryType
});

module.exports = schema;