Feature: Skills mutations
    Make sure skills data can be modified

    Scenario: Skills creation
        Given the defined GraphQL schema
        And the in-memory repositories
        When I perform the query
            """
            mutation {
            addSkill(input: {name: "Kanban", employeesId:[1, 2, 3]}) {
            id
            name
            employees {
            items {
            name
            }
            }
            }
            }
            """
        Then the total number of skills in the system is 98
        And the added skill name is "Kanban"
        And the added skill id is 98
        And the added skill has 3 employees

    Scenario: Skills deletion
        Given the defined GraphQL schema
        And the in-memory repositories
        When I perform the query
            """
            mutation {
            removeSkill(input: 1) {
            name
            }
            }
            """
        Then the total number of skills in the system is 96
        And the removed skill name is "Object Rexx"