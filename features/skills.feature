Feature: Skills API
    Make sure skills data is accessible through the GraphQL API, allowing for filtering, ordering and pagination

    Scenario: Skills total count
        Given the defined GraphQL schema
        And the in-memory repositories
        When I perform the query
            """
            {
            skill {
            totalCount
            }
            }
            """
        Then I should get a total count of 97 skills

    Scenario: Skills retrival
        Given the defined GraphQL schema
        And the in-memory repositories
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
        Then I should get 10 skills
        And the name of the skill 1 in the response should be equal to the name of the skill 1 in skills.json
