export const filterItemsByName = (name?: string) => <T extends { name: string }>(items: T[]) => {
    if (name) {
        const parsedName = name.toLowerCase();
        items = items.filter(x => x.name.toLowerCase().indexOf(parsedName) > -1);
    }
    return items;
};

export const sortByProperty = <T>(
    propertyName: keyof T,
    criteria: number,
    callback?: (a: T, b: T) => number
) => (a: T, b: T) => {
    if (a[propertyName] < b[propertyName]) return -criteria;
    if (a[propertyName] > b[propertyName]) return criteria;
    return callback ? callback(a, b) : 0;
};
