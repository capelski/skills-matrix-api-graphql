import {
    GraphQLFieldConfig,
    GraphQLInputObjectType,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString
} from 'graphql';
import { AppContext } from '../context/types';
import { definePagedListType } from './paged-list';

export const skillType = new GraphQLObjectType<any, AppContext>({
    fields() {
        const { employeeType } = require('./employee');
        return {
            employees: {
                args: {
                    filter: { type: skillEmployeeFilterType },
                    first: { type: GraphQLInt },
                    orderBy: { type: skillEmployeeOrderByType },
                    skip: { type: GraphQLInt }
                },
                resolve: (object, args, context) => {
                    context.ensurePermission(context.user, 'skills:read');
                    return context.skills.getSkillEmployees(
                        object.id,
                        args.skip,
                        args.first,
                        args.filter,
                        args.orderBy
                    );
                },
                type: definePagedListType(employeeType, 'SkillEmployeesPagedList')
            },
            id: {
                type: GraphQLInt
            },
            name: {
                type: new GraphQLNonNull(GraphQLString)
            }
        };
    },
    name: 'Skill'
});

const skillFilterType = new GraphQLInputObjectType({
    fields: {
        id: {
            type: GraphQLInt
        },
        name: {
            type: GraphQLString
        }
    },
    name: 'SkillFilter'
});

const skillEmployeeFilterType = new GraphQLInputObjectType({
    fields: {
        name: {
            type: GraphQLString
        }
    },
    name: 'SkillEmployeeFilter'
});

const skillOrderByType = new GraphQLInputObjectType({
    fields: {
        employees: {
            type: GraphQLInt
        },
        name: {
            type: GraphQLInt
        }
    },
    name: 'SkillOrderBy'
});

const skillEmployeeOrderByType = new GraphQLInputObjectType({
    fields: {
        name: {
            type: GraphQLInt
        }
    },
    name: 'SkillEmployeeOrderBy'
});

export const skillQueryField: GraphQLFieldConfig<any, AppContext> = {
    args: {
        filter: { type: skillFilterType },
        first: { type: GraphQLInt },
        orderBy: { type: skillOrderByType },
        skip: { type: GraphQLInt }
    },
    description: 'Returns the available skills',
    resolve(object, args, context) {
        if (args.filter && args.filter.id) {
            context.ensurePermission(context.user, 'skills:read');
            return context.skills.getById(args.filter.id).then(skill => ({
                items: [skill],
                totalCount: 1
            }));
        } else {
            context.ensurePermission(context.user, 'skills:read');
            return context.skills.getAll(args.skip, args.first, args.filter, args.orderBy);
        }
    },
    type: definePagedListType(skillType)
};

const addSkillInputType = new GraphQLInputObjectType({
    fields: {
        employeesId: { type: new GraphQLList(GraphQLInt) },
        name: { type: new GraphQLNonNull(GraphQLString) }
    },
    name: 'AddSkillInput'
});

const addSkill: GraphQLFieldConfig<any, AppContext> = {
    args: {
        input: { type: addSkillInputType }
    },
    description: 'Creates a new skill with the given name and employees',
    resolve(object, args, context) {
        context.ensurePermission(context.user, 'skills:create');
        return context.skills.create(args.input);
    },
    type: skillType
};

const removeSkill: GraphQLFieldConfig<any, AppContext> = {
    args: {
        input: { type: new GraphQLNonNull(GraphQLInt) }
    },
    description: 'Removes the skill identified by the input id',
    resolve(object, args, context) {
        context.ensurePermission(context.user, 'skills:delete');
        return context.skills.remove(args.input);
    },
    type: skillType
};

const updateSkillInputType = new GraphQLInputObjectType({
    fields: {
        employeesId: { type: new GraphQLList(GraphQLInt) },
        id: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLString }
    },
    name: 'updateSkillInput'
});

const updateSkill: GraphQLFieldConfig<any, AppContext> = {
    args: {
        input: { type: updateSkillInputType }
    },
    description: 'Updates the name and employees of the skill identified by id',
    resolve(object, args, context) {
        context.ensurePermission(context.user, 'skills:update');
        return context.skills.update(args.input);
    },
    type: skillType
};

export const skillMutations = {
    add: addSkill,
    remove: removeSkill,
    update: updateSkill
};
