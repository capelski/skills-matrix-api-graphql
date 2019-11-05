Feature: User permissions
    Make sure an error is returned if a user without permissions tries to access access the schema operations

    Scenario: Employees retrieval error
        Given the defined GraphQL schema
        And the postgre repositories
        And a user without permissions
        When I perform the query
            """
            {
            employee {
            items {
            name
            }
            }
            }
            """
        Then an error is returned
        And the error message contains "Unauthorized"
        And the error message contains "employees:read"

    Scenario: Skills retrieval error
        Given the defined GraphQL schema
        And the postgre repositories
        And a user without permissions
        When I perform the query
            """
            {
            skill {
            items {
            name
            }
            }
            }
            """
        Then an error is returned
        And the error message contains "Unauthorized"
        And the error message contains "skills:read"

    Scenario: Employees creation error
        Given the defined GraphQL schema
        And the postgre repositories
        And a user without permissions
        When I perform the query
            """
            mutation {
            addEmployee(input: {name: "Macklemore", skillsId:[1, 2, 3]}) {
            id
            name
            }
            }
            """
        Then an error is returned
        And the error message contains "Unauthorized"
        And the error message contains "employees:create"

    Scenario: Skills creation error
        Given the defined GraphQL schema
        And the postgre repositories
        And a user without permissions
        When I perform the query
            """
            mutation {
            addSkill(input: {name: "React", employeesId:[1, 2, 3]}) {
            id
            name
            }
            }
            """
        Then an error is returned
        And the error message contains "Unauthorized"
        And the error message contains "skills:create"

    Scenario: Employees deletion error
        Given the defined GraphQL schema
        And the postgre repositories
        And a user without permissions
        When I perform the query
            """
            mutation {
            removeEmployee(input: 1) {
            name
            }
            }
            """
        Then an error is returned
        And the error message contains "Unauthorized"
        And the error message contains "employees:delete"

    Scenario: Skills deletion error
        Given the defined GraphQL schema
        And the postgre repositories
        And a user without permissions
        When I perform the query
            """
            mutation {
            removeSkill(input: 1) {
            name
            }
            }
            """
        Then an error is returned
        And the error message contains "Unauthorized"
        And the error message contains "skills:delete"

    Scenario: Employees update error
        Given the defined GraphQL schema
        And the postgre repositories
        And a user without permissions
        When I perform the query
            """
            mutation {
            updateEmployee(input: { id: 1, name: "Adelina", skillsId: [1, 2]}) {
            name
            }
            }
            """
        Then an error is returned
        And the error message contains "Unauthorized"
        And the error message contains "employees:update"

    Scenario: Skills update error
        Given the defined GraphQL schema
        And the postgre repositories
        And a user without permissions
        When I perform the query
            """
            mutation {
            updateSkill(input: { id: 1, name: "VueJs", employeesId: [1, 2]}) {
            name
            }
            }
            """
        Then an error is returned
        And the error message contains "Unauthorized"
        And the error message contains "skills:update"
