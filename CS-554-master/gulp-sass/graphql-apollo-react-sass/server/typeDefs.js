//Create the type definitions for the query and our data

export const typeDefs = `#graphql
  type Query {
    employers: [Employer]
    employees: [Employee]
    employer(_id: Int!): Employer
    employee(_id: String!): Employee
  }

  type Employer {
    _id: Int
    name: String
    employees: [Employee]
    numOfEmployees: Int
  }

  type Employee {
    _id: String
    firstName: String
    lastName: String
    employer: Employer
  }

  type Mutation {
    addEmployee(
      firstName: String!
      lastName: String!
      employerId: Int!
    ): Employee
    removeEmployee(_id: String!): Employee
    editEmployee(
      _id: String!
      firstName: String
      lastName: String
      employerId: Int
    ): Employee
    addEmployer(name: String!): Employer
  }
`;
