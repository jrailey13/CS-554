import {GraphQLError} from 'graphql';

import {
  employees as employeeCollection,
  employers as employerCollection
} from './config/mongoCollections.js';

import {v4 as uuid} from 'uuid'; //for generating _id's

/* parentValue - References the type def that called it
    so for example when we execute numOfEmployees we can reference
    the parent's properties with the parentValue Paramater
*/

/* args - Used for passing any arguments in from the client
    for example, when we call 
    addEmployee(firstName: String!, lastName: String!, employerId: Int!): Employee
		
*/

export const resolvers = {
  Query: {
    employer: async (_, args) => {
      const employers = await employerCollection();
      const employer = await employers.findOne({_id: args._id});
      if (!employer) {
        //can't find the employer
        throw new GraphQLError('Employer Not Found', {
          extensions: {code: 'NOT_FOUND'}
        });
      }
      return employer;
    },
    employee: async (_, args) => {
      const employees = await employeeCollection();
      const employee = await employees.findOne({_id: args._id});
      if (!employee) {
        //can't find the employee
        throw new GraphQLError('Employee Not Found', {
          extensions: {code: 'NOT_FOUND'}
        });
      }
      return employee;
    },
    employers: async () => {
      const employers = await employerCollection();
      const allEmployers = await employers.find({}).toArray();
      if (!allEmployers) {
        //Could not get list
        throw new GraphQLError(`Internal Server Error`, {
          extensions: {code: 'INTERNAL_SERVER_ERROR'}
        });
      }
      return allEmployers;
    },
    employees: async () => {
      const employees = await employeeCollection();
      const allEmployees = await employees.find({}).toArray();
      if (!allEmployees) {
        //Could not get list
        throw new GraphQLError(`Internal Server Error`, {
          extensions: {code: 'INTERNAL_SERVER_ERROR'}
        });
      }
      return allEmployees;
    }
  },
  Employer: {
    numOfEmployees: async (parentValue) => {
      console.log(`parentValue in Employer`, parentValue);
      const employees = await employeeCollection();
      const numOfEmployees = await employees.count({
        employerId: parentValue._id
      });
      return numOfEmployees;
    },
    employees: async (parentValue) => {
      const employees = await employeeCollection();
      const employs = await employees
        .find({employerId: parentValue._id})
        .toArray();
      return employs;
    }
  },
  Employee: {
    employer: async (parentValue) => {
      //console.log(`parentValue in Employee`, parentValue);
      const employers = await employerCollection();
      const employer = await employers.findOne({_id: parentValue.employerId});
      return employer;
    }
  },
  Mutation: {
    addEmployee: async (_, args) => {
      const employees = await employeeCollection();
      const employers = await employerCollection();

      const newEmployee = {
        _id: uuid(),
        firstName: args.firstName,
        lastName: args.lastName,
        employerId: args.employerId
      };
      //make sure they entered a valid employer ID
      let employer = await employers.findOne({_id: args.employerId});
      if (!employer) {
        throw new GraphQLError(
          `Could not Find Employer with an ID of ${args.employerId}`,
          {
            extensions: {code: 'BAD_USER_INPUT'}
          }
        );
      }
      let insertedEmployee = await employees.insertOne(newEmployee);
      if (!insertedEmployee.acknowledged || !insertedEmployee.insertedId) {
        throw new GraphQLError(`Could not Add Employee`, {
          extensions: {code: 'INTERNAL_SERVER_ERROR'}
        });
      }
      return newEmployee;
    },
    removeEmployee: async (_, args) => {
      const employees = await employeeCollection();
      const deletedEmployee = await employees.findOneAndDelete({_id: args._id});

      if (!deletedEmployee) {
        throw new GraphQLError(
          `Could not delete employee with _id of ${args._id}`,
          {
            extensions: {code: 'NOT_FOUND'}
          }
        );
      }
      return deletedEmployee;
    },
    editEmployee: async (_, args) => {
      const employees = await employeeCollection();
      let newEmployee = await employees.findOne({_id: args._id});
      console.log(newEmployee);
      if (newEmployee) {
        if (args.firstName) {
          newEmployee.firstName = args.firstName;
        }
        if (args.lastName) {
          newEmployee.lastName = args.lastName;
        }
        if (args.employerId && args.employerId > 0) {
          const employers = await employerCollection();
          const employerCount = await employers.count({_id: args.employerId});
          if (employerCount === 1) {
            newEmployee.employerId = args.employerId;
          } else {
            throw new GraphQLError(
              `Could not Find Employer with an ID of ${args.employerId}`,
              {
                extensions: {code: 'BAD_USER_INPUT'}
              }
            );
          }
        }
        await employees.updateOne({_id: args._id}, {$set: newEmployee});
      } else {
        throw new GraphQLError(
          `Could not update employee with _id of ${args._id}`,
          {
            extensions: {code: 'NOT_FOUND'}
          }
        );
      }
      return newEmployee;
    },
    addEmployer: async (_, args) => {
      //check args
      const employers = await employerCollection();
      const employerCount = await employers.count({});
      const newEmployer = {
        _id: employerCount + 1,
        name: args.name
      };
      let insertEmployer = await employers.insertOne(newEmployer);
      if (!insertEmployer.acknowledged || !insertEmployer.insertedId) {
        throw new GraphQLError(`Could not Add Employer`, {
          extensions: {code: 'INTERNAL_SERVER_ERROR'}
        });
      }
      return newEmployer;
    }
  }
};
