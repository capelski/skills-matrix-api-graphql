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
        Then the skills total count of the employee 1 in the response is 5
        And the employee 1 in the response has 5 skills
        And the skill 1 of the employee 1 in the response is "Object Rexx"

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
        Then the skills total count of the employee 1 in the response is 4
        And the employee 1 in the response has 4 skills
        And the skill 4 of the employee 1 in the response is "NQC"

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
        Then the employee 1 in the response has 5 skills
        And the skill 1 of the employee 1 in the response is "NQC"

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
        Then the employee 1 in the response has 5 skills
        And the skill 1 of the employee 1 in the response is "Object Rexx"

    Scenario: Employee skills support skip argument
        Given the defined GraphQL schema
        And the in-memory repositories
        When I perform the query
            """
            {
            employee(filter: { id: 1 }) {
            items {
            skills(skip: 2) {
            totalCount
            items {
            name
            }
            }
            }
            }
            }
            """
        Then the skills total count of the employee 1 in the response is 5
        And the employee 1 in the response has 3 skills
        And the skill 1 of the employee 1 in the response is "NXT-G"

    Scenario: Employee skills support first argument
        Given the defined GraphQL schema
        And the in-memory repositories
        When I perform the query
            """
            {
            employee(filter: { id: 1 }) {
            items {
            skills(first: 2) {
            totalCount
            items {
            name
            }
            }
            }
            }
            }
            """
        Then the skills total count of the employee 1 in the response is 5
        And the employee 1 in the response has 2 skills
        And the skill 1 of the employee 1 in the response is "Object Rexx"

    Scenario: Employee skills support pagination
        Given the defined GraphQL schema
        And the in-memory repositories
        When I perform the query
            """
            {
            employee(filter: { id: 1 }) {
            items {
            skills(first: 2, skip: 3) {
            totalCount
            items {
            name
            }
            }
            }
            }
            }
            """
        Then the skills total count of the employee 1 in the response is 5
        And the employee 1 in the response has 2 skills
        And the skill 1 of the employee 1 in the response is "NSIS"