import React, {useState} from 'react';
import './App.scss';
import {useQuery} from '@apollo/client';
import queries from '../queries';
import Add from './Add';

function Employers() {
  const [showAddForm, setShowAddForm] = useState(false);
  const closeAddFormState = () => {
    setShowAddForm(false);
  };
  const {loading, error, data} = useQuery(
    queries.GET_EMPLOYERS_WITH_EMPLOYEES,
    {
      fetchPolicy: 'cache-and-network'
    }
  );

  if (data) {
    const {employers} = data;

    return (
      <div>
        <button className='button' onClick={() => setShowAddForm(!showAddForm)}>
          Create Employer
        </button>
        {showAddForm && (
          <Add type='employer' closeAddFormState={closeAddFormState} />
        )}
        <br />
        <br />
        <div>
          {employers.map((employer) => {
            return (
              <div className='card' key={employer._id}>
                <div className='card-body'>
                  <h5 className='card-title'>{employer.name}</h5>
                  <span>Number of Employees:</span> {employer.numOfEmployees}
                  <br />
                  <br />
                  <span>Employees:</span>
                  <br />
                  <ol>
                    {employer.employees.map((employee) => {
                      return (
                        <li key={employee._id}>
                          {employee.firstName} {employee.lastName}
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  } else if (loading) {
    return <div>Loading</div>;
  } else if (error) {
    return <div>{error.message}</div>;
  }
}

export default Employers;
