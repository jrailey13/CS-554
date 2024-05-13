import AppContext from '../context/context';
import {useContext} from 'react';
const AllUsers = () => {
  const context = useContext(AppContext);

  return (
    <div className='allUsers'>
      <h3>Users</h3>
      <ul>
        {context.users.map((user) => {
          return <li key={user.id}>{user.name}</li>;
        })}
      </ul>
      <br />
      <button
        onClick={() =>
          context.userDispatch({
            type: 'CREATE_USER',
            payload: {name: 'Mickey Mouse', email: 'MMouse@disney.com'}
          })
        }
      >
        Add User
      </button>
    </div>
  );
};

export default AllUsers;
