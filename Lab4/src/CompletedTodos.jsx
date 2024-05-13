import React from 'react';

function CompletedTodos(props) {
    const incompleteButton = (todo) => {
        props.toggleCompleted(todo);
    }

    const completedToDos = props.toDos.filter(obj => {
        return obj.completed === true;
    });

    return (
        <div id="completedToDos">
            <h1>Completed To Dos</h1>
            {completedToDos.map(obj => (
                <div key={obj.title}>
                    <h3>{obj.title}</h3>
                    <p>{obj.description}</p>
                    <p>Due Date: {obj.due}</p>
                    <p>Completed: Yes</p>
                    <button onClick={() => incompleteButton(obj)}>Mark Incomplete</button>
                </div>
            ))}
        </div>
    );
}
export default CompletedTodos;