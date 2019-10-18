const {
    GraphQLInt,
    GraphQLList,
    GraphQLObjectType,
} = require('graphql');

const definePagedListType = (itemType, typeName) => new GraphQLObjectType({
    name: typeName || `${itemType}PagedList`,
    fields: () => {
        return {
            items: {
                type: new GraphQLList(itemType)
            },
            totalCount: {
                type: GraphQLInt,
            }
        };
    }
});

module.exports = definePagedListType;