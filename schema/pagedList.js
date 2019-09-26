const {
    GraphQLInt,
    GraphQLList,
    GraphQLObjectType,
} = require('graphql');

const definePagedListType = (itemType) => new GraphQLObjectType({
    name: `${itemType}PagedList`,
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