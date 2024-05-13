import AppContext from '../context/context';
import {useContext} from 'react';
const AllTodos = () => {
  const context = useContext(AppContext);

  return (
    <div className='allTodos'>
      <h3>Todos</h3>
      <ul>
        {context.todos.map((todo) => {
          return <li key={todo.id}>{todo.task}</li>;
        })}
      </ul>
      <br />
      <button
        onClick={() =>
          context.todoDispatch({
            type: 'CREATE_TODO',
            payload: {
              task: 'Task Added from ALL component',
              taskDesc: 'How now brown cow?'
            }
          })
        }
      >
        Add Task
      </button>
    </div>
  );
};

export default AllTodos;
