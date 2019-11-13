import { GraphQLSchema } from 'graphql';
import { AppContext } from '../../src/context/types';
import { User } from '../../src/permissions';
import { Repositories } from '../../src/repositories/types';

export interface RepositoriesImplementation {
    context?: AppContext;
    queryResult?: any;
    repositories: Repositories;
}

export interface CucumberContext {
    implementations: RepositoriesImplementation[];
    schema?: GraphQLSchema;
    user?: User;
}

export const cucumberContext: CucumberContext = {
    implementations: [],
    schema: undefined,
    user: undefined
};
