Feature: Employees API
    Make sure employees data is accessible through the GraphQL API, allowing for filtering, ordering and pagination

    Scenario: Employees total count
        Given the defined GraphQL schema
        And the in-memory repositories
        When I perform the query
            """
            {
            employee {
            totalCount
            }
            }
            """
        Then I should get a total count of 97 employees

    Scenario: Employees retrival
        Given the defined GraphQL schema
        And the in-memory repositories
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
        Then I should get 10 employees
        And the name of the employee 1 in the response should be equal to the name of the employee 1 in employees.json
