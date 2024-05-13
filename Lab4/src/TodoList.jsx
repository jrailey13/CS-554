import React from 'react';
import {useState} from 'react';

function TodoList(props) {
    const deleteButton = (id) => {
        props.deleteToDo(id);
    }

    const completeButton = (todo) => {
        props.toggleCompleted(todo);
    }

    const uncompletedToDos = props.toDos.filter(obj => {
        return obj.completed === false;
    });

    // Due date implementation inspired by https://simplefrontend.com/set-conditional-classname-in-react/#:~:text=The%20best%20and%20simplest%20way%20is%20to%20use%20JavaScript%20ternary%20operator.&text=If%20the%20condition%20is%20evaluated,%E2%80%9C%E2%80%9D)%20instead%20of%20null.
    return (
        <div id="toDos">
            <h1>To Do List</h1>
            {uncompletedToDos.map(obj => (
                <div key={obj.title}>
                    <h3 className={new Date(obj.due) < new Date() ? 'DNF' : 'TBD'}>{obj.title}</h3>
                    <p>{obj.description}</p>
                    <p className={new Date(obj.due) < new Date() ? 'DNF' : 'TBD'}>Due Date: {obj.due}</p>
                    <p>Completed: No</p>
                    <button onClick={() => deleteButton(obj.id)}>Delete</button>
                    <button onClick={() => completeButton(obj)}>Complete</button>
                </div>
            ))}
        </div>
    );
}

export default TodoList;