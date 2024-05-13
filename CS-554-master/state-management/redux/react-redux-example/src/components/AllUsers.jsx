import {useSelector, useDispatch} from 'react-redux';
import * as actions from '../actions';

const AllUsers = () => {
  const dispatch = useDispatch();
  const allUsers = useSelector((state) => state.users);

  return (
    <div className='allUsers'>
      <h3>Users</h3>
      <ul>
        {allUsers.map((user) => {
          return <li key={user.id}>{user.name}</li>;
        })}
      </ul>
      <br />
      <button
        onClick={() =>
          dispatch(actions.addUser('Mickey Mouse', 'MMouse@disney.com'))
        }
      >
        Add User
      </button>
    </div>
  );
};

export default AllUsers;
