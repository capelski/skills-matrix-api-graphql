Feature: Employee skills
    Make sure the skills of an employee can be filtered, sorted and paginated

    Scenario: Employee skills retrieval and count
        Given the defined GraphQL schema
        And the in-memory repositories
        When I perform the query
            """
            {
            employee(filter: { id: 1 }) {
            items {
            skills {
            totalCount
            items {
            name
            }
            }
            }
            }
            }
            """
        Then the skills total count of the employee 1 in the response should be 5
        And the employee 1 in the response should have 5 skills
        And the skill 1 of the employee 1 in the response should be "Object Rexx"

    Scenario: Employee skills filtering by name
        Given the defined GraphQL schema
        And the in-memory repositories
        When I perform the query
            """
            {
            employee(filter: { id: 1 }) {
            items {
            skills(filter: {name: "N"}) {
            totalCount
            items {
            name
            }
            }
            }
            }
            }
            """
        Then the skills total count of the employee 1 in the response should be 4
        And the employee 1 in the response should have 4 skills
        And the skill 4 of the employee 1 in the response should be "NQC"

    Scenario: Employee skills ordering by name ascending
        Given the defined GraphQL schema
        And the in-memory repositories
        When I perform the query
            """
            {
            employee(filter: { id: 1 }) {
            items {
            skills(orderBy: { name: 1 }) {
            items {
            name
            }
            }
            }
            }
            }
            """
        Then the employee 1 in the response should have 5 skills
        And the skill 1 of the employee 1 in the response should be "NQC"

    Scenario: Employee skills ordering by name descending
        Given the defined GraphQL schema
        And the in-memory repositories
        When I perform the query
            """
            {
            employee(filter: { id: 1 }) {
            items {
            skills(orderBy: { name: -1 }) {
            items {
            name
            }
            }
            }
            }
            }
            """
        Then the employee 1 in the response should have 5 skills
        And the skill 1 of the employee 1 in the response should be "Object Rexx"