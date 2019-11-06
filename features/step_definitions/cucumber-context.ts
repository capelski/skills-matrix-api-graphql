import { User } from '../../src/permissions';

// TODO Add proper typing
export interface CucumberContext {
    context: any;
    queryResult: any;
    repositories: any;
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
