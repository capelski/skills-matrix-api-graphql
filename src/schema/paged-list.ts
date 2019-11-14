import { GraphQLInt, GraphQLList, GraphQLObjectType } from 'graphql';

export const definePagedListType = (itemType: GraphQLObjectType, typeName?: string) =>
    new GraphQLObjectType({
        fields() {
            return {
                items: {
                    type: new GraphQLList(itemType)
                },
                totalCount: {
                    type: GraphQLInt
                }
            };
        },
        name: typeName || `${itemType}PagedList`
    });
