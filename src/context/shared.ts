/*
This function is needed to make sure the number of returned elements is
the same as the number of input parameters as well as the order of the former
corresponds to order of the later. Otherwise, DataLoader complains:

DataLoader must be constructed with a function which accepts Array<key> and returns
Promise<Array<value>>, but the function did not return a Promise of an Array of the
same length as the Array of keys.\n\nKeys:\n-1,2\n\nValues:\n[object Object]
 */

export const dataLoaderMatcher = (ids: number[]) => <T extends { id: number }>(
    rows: Array<T | undefined>
) => {
    return ids.map(id => {
        const row = rows.find(r => r && r.id === id);
        return row ? row : undefined;
    });
};
