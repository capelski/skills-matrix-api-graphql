Feature: Employees mutations
    Make sure employees data can be modified

    Scenario: Employees creation
        Given the defined GraphQL schema
        And a user having "employees" permissions
        When I perform the query
            """
            mutation {
            addEmployee(input: {name: "Macklemore", skillsId:[1, 2, 3]}) {
            id
            name
            skills {
            items {
            name
            }
            }
            }
            }
            """
        Then the total number of employees in the system is 98
        And the added employee name is "Macklemore"
        And the added employee id is 98
        And the added employee has 3 skills

    Scenario: Employees deletion
        Given the defined GraphQL schema
        And a user having "employees" permissions
        When I perform the query
            """
            mutation {
            removeEmployee(input: 1) {
            name
            }
            }
            """
        Then the total number of employees in the system is 96
        And the removed employee name is "Adele"

    Scenario: Employees update
        Given the defined GraphQL schema
        And a user having "employees" permissions
        When I perform the query
            """
            mutation {
            updateEmployee(input: { id: 1, name: "Adelina", skillsId: [1, 2]}) {
            name
            skills {
            items {
            name
            }
            }
            }
            }
            """
        Then the updated employee name is "Adelina"
        And the updated employee has 2 skills
