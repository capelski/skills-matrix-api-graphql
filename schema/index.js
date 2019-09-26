const {
    GraphQLObjectType,
    GraphQLSchema
} = require('graphql');
// TODO Create connection Types for Employee/Skill in order to be able to paginate related entities
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