import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { employeeQueryField, employeeMutations } from './employee';
import { skillQueryField, skillMutations } from './skill';

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
        addSkill: skillMutations.add,
        removeEmployee: employeeMutations.remove,
        removeSkill: skillMutations.remove,
        updateEmployee: employeeMutations.update,
        updateSkill: skillMutations.update
    }
});

export default new GraphQLSchema({
    query: rootQueryType,
    mutation: rootMutationType
});
