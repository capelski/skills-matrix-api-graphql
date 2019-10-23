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
        Then I get a total count of 97 skills
        And I get 10 skills
        And the skill 1 in the response is "Object Rexx"

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
        Then I get a total count of 4 skills
        And I get 4 skills
        And the skill 3 in the response is "Bash"

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
        Then I get a total count of 1 skills
        And I get 1 skills
        And the skill 1 in the response is "Modula-3"

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
        Then the skill 1 in the response is "Angelscript 4"

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
        Then the skill 1 in the response is "xBase"

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
        Then the skill 1 in the response is "Angelscript 4"

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
        Then the skill 1 in the response is "Object Rexx"

    Scenario: Skills support skip argument
        Given the defined GraphQL schema
        And the in-memory repositories
        When I perform the query
            """
            {
            skill(skip: 10) {
            totalCount
            items {
            name
            }
            }
            }
            """
        Then I get a total count of 97 skills
        And the skill 1 in the response is "MOO"

    Scenario: Skills support first argument
        Given the defined GraphQL schema
        And the in-memory repositories
        When I perform the query
            """
            {
            skill(first: 2) {
            totalCount
            items {
            name
            }
            }
            }
            """
        Then I get a total count of 97 skills
        And I get 2 skills

    Scenario: Skills support pagination
        Given the defined GraphQL schema
        And the in-memory repositories
        When I perform the query
            """
            {
            skill(first: 5, skip: 20) {
            totalCount
            items {
            name
            }
            }
            }
            """
        Then I get a total count of 97 skills
        And I get 5 skills
        And the skill 1 in the response is "Occam"