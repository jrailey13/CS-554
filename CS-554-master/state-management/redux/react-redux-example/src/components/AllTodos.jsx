import {useSelector, useDispatch} from 'react-redux';
import * as actions from '../actions';

const AllTodos = () => {
  const dispatch = useDispatch();
  const allTodos = useSelector((state) => state.todos);

  return (
    <div className='allTodos'>
      <h3>Todos</h3>
      <ul>
        {allTodos.map((todo) => {
          return <li key={todo.id}>{todo.task}</li>;
        })}
      </ul>
      <br />
      <button
        onClick={() =>
          dispatch(
            actions.addTodo(
              'Task Added from ALL component',
              'How now brown cow?'
            )
          )
        }
      >
        Add Task
      </button>
    </div>
  );
};

export default AllTodos;
