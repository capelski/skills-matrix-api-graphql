Feature: Skill employees
    Make sure the employees of a skill can be filtered, sorted and paginated

    Scenario: Skill employees retrieval and count
        Given the defined GraphQL schema
        And the in-memory repositories
        When I perform the query
            """
            {
            skill(filter: { id: 1 }) {
            items {
            employees {
            totalCount
            items {
            name
            }
            }
            }
            }
            }
            """
        Then the employees total count of the skill 1 in the response should be 5
        And the skill 1 in the response should have 5 employees
        And the employee 1 of the skill 1 in the response should be "Adele"

    Scenario: Skill employees filtering by name
        Given the defined GraphQL schema
        And the in-memory repositories
        When I perform the query
            """
            {
            skill(filter: { id: 1 }) {
            items {
            employees(filter: {name: "M"}) {
            totalCount
            items {
            name
            }
            }
            }
            }
            }
            """
        Then the employees total count of the skill 1 in the response should be 4
        And the skill 1 in the response should have 4 employees
        And the employee 4 of the skill 1 in the response should be "Amy Macdonald"

    Scenario: Skill employees ordering by name ascending
        Given the defined GraphQL schema
        And the in-memory repositories
        When I perform the query
            """
            {
            skill(filter: { id: 1 }) {
            items {
            employees(orderBy: { name: 1 }) {
            items {
            name
            }
            }
            }
            }
            }
            """
        Then the skill 1 in the response should have 5 employees
        And the employee 1 of the skill 1 in the response should be "Adele"

    Scenario: Skill employees ordering by name descending
        Given the defined GraphQL schema
        And the in-memory repositories
        When I perform the query
            """
            {
            skill(filter: { id: 1 }) {
            items {
            employees(orderBy: { name: -1 }) {
            items {
            name
            }
            }
            }
            }
            }
            """
        Then the skill 1 in the response should have 5 employees
        And the employee 1 of the skill 1 in the response should be "Zayn Malik"