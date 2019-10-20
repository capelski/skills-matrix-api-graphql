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
        And the employee 1 in the response should be "Adele"

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
        And the employee 2 in the response should be "Adam Leonardo"

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
        Then the employee 1 in the response should be "Elton John"

    Scenario: Employees ordering by name ascending
        Given the defined GraphQL schema
        And the in-memory repositories
        When I perform the query
            """
            {
            employee(orderBy: { name: 1 }) {
            items {
            name
            }
            }
            }
            """
        Then the employee 1 in the response should be "Adam Leonardo"

    Scenario: Employees ordering by name descending
        Given the defined GraphQL schema
        And the in-memory repositories
        When I perform the query
            """
            {
            employee(orderBy: { name: -1 }) {
            items {
            name
            }
            }
            }
            """
        Then the employee 1 in the response should be "Zayn Malik"

    Scenario: Employees ordering by skills length ascending
        Given the defined GraphQL schema
        And the in-memory repositories
        When I perform the query
            """
            {
            employee(orderBy: { skills: 1 }) {
            items {
            name
            }
            }
            }
            """
        Then the employee 1 in the response should be "Adam Leonardo"

    Scenario: Employees ordering by skills length descending
        Given the defined GraphQL schema
        And the in-memory repositories
        When I perform the query
            """
            {
            employee(orderBy: { skills: -1 }) {
            items {
            name
            }
            }
            }
            """
        Then the employee 1 in the response should be "Adele"

    Scenario: Employees support skip argument
        Given the defined GraphQL schema
        And the in-memory repositories
        When I perform the query
            """
            {
            employee(skip: 10) {
            items {
            name
            }
            }
            }
            """
        Then the employee 1 in the response should be "Dua Lipa"

# TODO Test first
# TODO Mixed arguments