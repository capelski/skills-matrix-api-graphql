import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { employeeMutations, employeeQueryField } from './employee';
import { skillMutations, skillQueryField } from './skill';

const rootQueryType = new GraphQLObjectType({
    fields: () => {
        return {
            employee: employeeQueryField,
            skill: skillQueryField
        };
    },
    name: 'RootQuery'
});

const rootMutationType = new GraphQLObjectType({
    fields: {
        addEmployee: employeeMutations.add,
        addSkill: skillMutations.add,
        removeEmployee: employeeMutations.remove,
        removeSkill: skillMutations.remove,
        updateEmployee: employeeMutations.update,
        updateSkill: skillMutations.update
    },
    name: 'RootMutation'
});

export default new GraphQLSchema({
    mutation: rootMutationType,
    query: rootQueryType
});
