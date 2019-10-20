Feature: Skills API
    Make sure skills data is accessible through the GraphQL API, allowing for filtering, ordering and pagination

    Scenario: Skills retrival and total count
        Given the defined GraphQL schema
        And the in-memory repositories
        When I perform the query
            """
            {
            skill {
            totalCount
            items {
            name
            }
            }
            }
            """
        Then I should get a total count of 97 skills
        And I should get 10 skills
        And the name of the skill 1 in the response should be equal to the name of the skill 1 in skills.json

    Scenario: Skills filtering by name
        Given the defined GraphQL schema
        And the in-memory repositories
        When I perform the query
            """
            {
            skill(filter: { name: "Ba" }) {
            totalCount
            items {
            name
            }
            }
            }
            """
        Then I should get a total count of 4 skills
        And I should get 4 skills
        And the name of the skill 3 in the response should be equal to the name of the skill 66 in skills.json

    Scenario: Skills filtering by id
        Given the defined GraphQL schema
        And the in-memory repositories
        When I perform the query
            """
            {
            skill(filter: { id: 13 }) {
            totalCount
            items {
            name
            }
            }
            }
            """
        Then I should get a total count of 1 skills
        And I should get 1 skills
        And the name of the skill 1 in the response should be equal to the name of the skill 13 in skills.json

    Scenario: Skills ordering by name ascending
        Given the defined GraphQL schema
        And the in-memory repositories
        When I perform the query
            """
            {
            skill(orderBy: { name: 1 }) {
            items {
            name
            }
            }
            }
            """
        Then the name of the skill 1 in the response should be equal to the name of the skill 97 in skills.json

    Scenario: Skills ordering by name descending
        Given the defined GraphQL schema
        And the in-memory repositories
        When I perform the query
            """
            {
            skill(orderBy: { name: -1 }) {
            items {
            name
            }
            }
            }
            """
        Then the name of the skill 1 in the response should be equal to the name of the skill 47 in skills.json

    Scenario: Skills ordering by employees length ascending
        Given the defined GraphQL schema
        And the in-memory repositories
        When I perform the query
            """
            {
            skill(orderBy: { employees: 1 }) {
            items {
            name
            }
            }
            }
            """
        Then the name of the skill 1 in the response should be equal to the name of the skill 97 in skills.json

    Scenario: Skills ordering by employees length descending
        Given the defined GraphQL schema
        And the in-memory repositories
        When I perform the query
            """
            {
            skill(orderBy: { employees: -1 }) {
            items {
            name
            }
            }
            }
            """
        Then the name of the skill 1 in the response should be equal to the name of the skill 1 in skills.json

# TODO Test skip
# TODO Test first
# TODO Mixed arguments