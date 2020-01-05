# Skills matrix

![Skills matrix logo](https://github.com/L3bowski/skills-matrix-mvc/blob/master/wwwroot/images/skills.png)

Node.js GraphQL web Api exposing CRUD operations to query and modify the employees and skills of a company. The data model consists in three entities:

-   **employee**: Name and id
-   **skill**: Name and id
-   **employee-skill**: Relational entity containing the id of a skill and the id of an employee

The application is meant to connect against a PostgreSQL server. If no server is available or in case the connection fails, the application still will run using an In Memory data set (ideal if you don't want to bother installing PostgreSQL in your machine). The web Api exposes the following endpoints:

-   **/**: Graphql endpoint exposing the application schema, which **does not require an Authorization token**
-   **/auth**: Graphql endpoint exposing the application schema, which **does require an Authorization token**
-   **/data-loader**: Graphql endpoint exposing the application schema, which **does require an Authorization token** and uses dataloader to batch queries and improve database performance. Can be tested with any query like:

```graphql
query PerformanceTest {
    One: employee(filter: { id: 1 }) {
        items {
            id
            name
        }
    }
    Two: employee(filter: { id: 2 }) {
        items {
            id
            name
        }
    }
    sqlQueries
}
```

This application does not implement user authentication so, in order to get authorization tokens for the **/auth** endpoint, the following mock endpoints can be used:

-   /nobody-token: Returns a JWT token for a user with no permissions
-   /employees-token: Returns a JWT token for a user with permissions on all employees operations
-   /skills-token: Returns a JWT token for a user with permissions on all skills operations
-   /admin-token: Returns a JWT token for a user with permissions on both skills and employees operations

To get the wep Api up and running:

```bash
npm install
npm start
```

And finally some Graphql queries that might come handy:

```graphql
{
    __schema {
        mutationType {
            name
            fields {
                name
                description
            }
        }
        queryType {
            name
            fields {
                name
                description
            }
        }
    }
}
```

```graphql
{
    employee(filter: { name: "A" }, first: 2, skip: 1, orderBy: { skills: -1 }) {
        totalCount
        items {
            id
            name
            skills(orderBy: { name: 1 }) {
                totalCount
                items {
                    id
                    name
                }
            }
        }
    }
}
```

```graphql
mutation {
    addSkill(input: { name: "Vue.js", employeesId: [7, 23, 86] }) {
        id
        employees {
            items {
                name
            }
        }
    }
}
```

Have fun!
