import {
    GraphQLFieldConfig,
    GraphQLList,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString
} from 'graphql';
import { AppContext } from '../context/types';
import { employeeMutations, employeeQueryField } from './employee';
import { skillMutations, skillQueryField } from './skill';

const sqlQueriesField: GraphQLFieldConfig<any, AppContext> = {
    description: 'The set of sql queries executed to resolve the current request',
    resolve(object, args, context) {
        return context.sqlQueries!.getAll();
    },
    type: new GraphQLList(GraphQLString)
};

const rootQueryType = new GraphQLObjectType({
    fields: () => {
        return {
            employee: employeeQueryField,
            skill: skillQueryField,
            sqlQueries: sqlQueriesField
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
