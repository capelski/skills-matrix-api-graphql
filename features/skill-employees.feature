Feature: Skill employees
    Make sure the employees of a skill can be filtered, sorted and paginated

    Scenario: Skill employees retrieval and count
        Given the defined GraphQL schema
        And the postgre repositories
        And a user having "skills" permissions
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
        Then the employees total count of the skill 1 in the response is 5
        And the skill 1 in the response has 5 employees
        And the employee 1 of the skill 1 in the response is "Adele"

    Scenario: Skill employees filtering by name
        Given the defined GraphQL schema
        And the postgre repositories
        And a user having "skills" permissions
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
        Then the employees total count of the skill 1 in the response is 4
        And the skill 1 in the response has 4 employees
        And the employee 4 of the skill 1 in the response is "Amy Macdonald"

    Scenario: Skill employees ordering by name ascending
        Given the defined GraphQL schema
        And the postgre repositories
        And a user having "skills" permissions
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
        Then the skill 1 in the response has 5 employees
        And the employee 1 of the skill 1 in the response is "Adele"

    Scenario: Skill employees ordering by name descending
        Given the defined GraphQL schema
        And the postgre repositories
        And a user having "skills" permissions
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
        Then the skill 1 in the response has 5 employees
        And the employee 1 of the skill 1 in the response is "Zayn Malik"

    Scenario: Skill employees support skip argument
        Given the defined GraphQL schema
        And the postgre repositories
        And a user having "skills" permissions
        When I perform the query
            """
            {
            skill(filter: { id: 1 }) {
            items {
            employees(skip: 2) {
            totalCount
            items {
            name
            }
            }
            }
            }
            }
            """
        Then the employees total count of the skill 1 in the response is 5
        And the skill 1 in the response has 3 employees
        And the employee 1 of the skill 1 in the response is "Zayn Malik"

    Scenario: Skill employees support first argument
        Given the defined GraphQL schema
        And the postgre repositories
        And a user having "skills" permissions
        When I perform the query
            """
            {
            skill(filter: { id: 1 }) {
            items {
            employees(first: 2) {
            totalCount
            items {
            name
            }
            }
            }
            }
            }
            """
        Then the employees total count of the skill 1 in the response is 5
        And the skill 1 in the response has 2 employees
        And the employee 1 of the skill 1 in the response is "Adele"

    Scenario: Skill employees support pagination
        Given the defined GraphQL schema
        And the postgre repositories
        And a user having "skills" permissions
        When I perform the query
            """
            {
            skill(filter: { id: 1 }) {
            items {
            employees(first: 2, skip: 3) {
            totalCount
            items {
            name
            }
            }
            }
            }
            }
            """
        Then the employees total count of the skill 1 in the response is 5
        And the skill 1 in the response has 2 employees
        And the employee 1 of the skill 1 in the response is "Emily Maguire"