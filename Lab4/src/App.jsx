import { useState } from 'react'
import './App.css'
import {v4 as uuidv4} from 'uuid';
import TodoList from "./TodoList.jsx";
import CompletedTodos from "./CompletedTodos.jsx";
import AddTodo from "./AddTodo.jsx";

let toDoList = [
    {
        id: uuidv4(),
        title: 'Get groceries',
        description: 'Go to ACME for groceries this weekend',
        due: '9/15/2024',
        completed: false
    },
    {
        id: uuidv4(),
        title: 'Call Grandma Joan',
        description: 'Catch up with Grandma Joan and see how she is doing',
        due: '9/12/2024',
        completed: false
    },
    {
        id: uuidv4(),
        title: 'Talk to my boss',
        description: 'Chat with the boss about a promotion',
        due: '9/10/2024',
        completed: false
    },
    {
        id: uuidv4(),
        title: 'Get back into the gym',
        description: 'Want to start working out again',
        due: '9/08/2024',
        completed: false
    },
    {
        id: uuidv4(),
        title: 'Do my taxes',
        description: 'File your taxes and get that $$$',
        due: '10/1/2024',
        completed: false
    },
    {
        id: uuidv4(),
        title: 'Do the laundry',
        description: 'Do you laundry when you get home from work',
        due: '9/1/2024',
        completed: false
    },
    {
        id: uuidv4(),
        title: 'Take Spike for a walk',
        description: 'Take the dog for a walk when I get home',
        due: '9/1/2024',
        completed: false
    },
    {
        id: uuidv4(),
        title: 'Tell Brandon happy birthday',
        description: 'Best friends birthday is coming up so dont forget',
        due: '9/2/2024',
        completed: false
    },
    {
        id: uuidv4(),
        title: 'Submit homework',
        description: 'Homework is due Friday at midnight, remember to submit it',
        due: '9/04/2024',
        completed: false
    },
    {
        id: uuidv4(),
        title: 'Study for midterms',
        description: 'Start studying now for midterms',
        due: '9/09/2024',
        completed: false
    }];

function App() {
  const [state, setState] = useState(toDoList);

  const deleteTodo = (id) => {
      setState((prevState) => prevState.filter(function(obj ) {
          return obj.id !== id;
      }));
  }

  // https://www.geeksforgeeks.org/how-to-modify-an-objects-property-in-an-array-of-objects-in-javascript/
  const toggleCompleted = (todo) => {
      setState((prevState) => prevState.map(obj => {
          if (obj.id === todo.id) {
              return {...obj, completed: !obj.completed}
          }
          return obj
      }));
  }

  const addToDo = (title, description, dueDate) => {
      const newToDo = {
          id: uuidv4(),
          title: title,
          description: description,
          due: dueDate,
          completed: false
      }

      setState((prevState) => [...prevState, newToDo]);
  }

  return (
    <div>
        <AddTodo
            addTodo={addToDo}
        />

        <TodoList
            toDos={state}
            toggleCompleted={toggleCompleted}
            deleteToDo={deleteTodo}
        />

        <CompletedTodos
            toDos={state}
            toggleCompleted={toggleCompleted}
        />
    </div>
  )
}

export default App
