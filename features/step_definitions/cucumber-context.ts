import { AppContext } from '../../src/context/types';
import { User } from '../../src/permissions';
import { Repositories } from '../../src/repositories/types';

// TODO Add proper typing
export interface CucumberContext {
    context?: AppContext;
    queryResult: any;
    repositories?: Repositories;
    schema: any;
    user?: User;
}

export const cucumberContext: CucumberContext = {
    context: undefined,
    queryResult: undefined,
    repositories: undefined,
    schema: undefined,
    user: undefined
};
