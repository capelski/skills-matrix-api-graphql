Feature: Employees API
    Make sure employees data is accessible through the GraphQL API, allowing for filtering, ordering and pagination

    Scenario: Employees retrival and total count
        Given the defined GraphQL schema
        And the in-memory repositories
        When I perform the query
            """
            {
            employee {
            totalCount
            items {
            name
            }
            }
            }
            """
        Then I should get a total count of 97 employees
        And I should get 10 employees
        And the name of the employee 1 in the response should be equal to the name of the employee 1 in employees.json

    Scenario: Employees filtering by name
        Given the defined GraphQL schema
        And the in-memory repositories
        When I perform the query
            """
            {
            employee(filter: { name: "Ad" }) {
            totalCount
            items {
            name
            }
            }
            }
            """
        Then I should get a total count of 3 employees
        And I should get 3 employees
        And the name of the employee 2 in the response should be equal to the name of the employee 14 in employees.json

    Scenario: Employees filtering by id
        Given the defined GraphQL schema
        And the in-memory repositories
        When I perform the query
            """
            {
            employee(filter: { id: 48 }) {
            totalCount
            items {
            name
            }
            }
            }
            """
        Then I should get a total count of 1 employees
        And I should get 1 employees
        And the name of the employee 1 in the response should be equal to the name of the employee 48 in employees.json

# TODO Test skip and first