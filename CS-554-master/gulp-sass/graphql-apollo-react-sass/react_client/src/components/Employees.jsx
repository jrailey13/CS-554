import React, {useState} from 'react';
import './App.scss';
import {useQuery} from '@apollo/client';
import queries from '../queries';
import Add from './Add';
import DeleteEmployeeModal from './DeleteEmployeeModal';
import EditEmployeeModal from './EditEmployeeModal';
function Employees() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);
  const [deleteEmployee, setDeleteEmployee] = useState(null);

  const {loading, error, data} = useQuery(queries.GET_EMPLOYEES, {
    fetchPolicy: 'cache-and-network'
  });
  const handleOpenEditModal = (employee) => {
    setShowEditModal(true);
    setEditEmployee(employee);
  };

  const handleOpenDeleteModal = (employee) => {
    setShowDeleteModal(true);
    setDeleteEmployee(employee);
  };
  const closeAddFormState = () => {
    setShowAddForm(false);
  };

  const handleCloseModals = () => {
    setShowEditModal(false);
    setShowDeleteModal(false);
  };

  if (data) {
    const {employees} = data;
    return (
      <div>
        <button className='button' onClick={() => setShowAddForm(!showAddForm)}>
          Create Employee
        </button>
        {showAddForm && (
          <Add type='employee' closeAddFormState={closeAddFormState} />
        )}
        <br />
        <br />

        {employees.map((employee) => {
          return (
            <div className='card' key={employee._id}>
              <div className='card-body'>
                <h5 className='card-title'>
                  {employee.firstName} {employee.lastName}
                </h5>
                Employer: {employee.employer.name}
                <br />
                <button
                  className='button'
                  onClick={() => {
                    handleOpenEditModal(employee);
                  }}
                >
                  Edit
                </button>
                <button
                  className='button'
                  onClick={() => {
                    handleOpenDeleteModal(employee);
                  }}
                >
                  Delete
                </button>
                <br />
              </div>
            </div>
          );
        })}
        {showEditModal && (
          <EditEmployeeModal
            isOpen={showEditModal}
            employee={editEmployee}
            handleClose={handleCloseModals}
          />
        )}

        {showDeleteModal && (
          <DeleteEmployeeModal
            isOpen={showDeleteModal}
            handleClose={handleCloseModals}
            deleteEmployee={deleteEmployee}
          />
        )}
      </div>
    );
  } else if (loading) {
    return <div>Loading</div>;
  } else if (error) {
    return <div>{error.message}</div>;
  }
}

export default Employees;
