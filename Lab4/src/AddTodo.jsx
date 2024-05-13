import {useState} from 'react';

function AddTodo(props) {
    const [toDoData, setToDoData] = useState({
        title: "",
        description: "",
        dueDate: "",
        errors: {}
    });

    const addTodo = (toDo) => {
        const {name, value} = toDo.target;
        setToDoData((prevState) => ({...prevState, [name]: value}));
    }

    const validateForm = () => {
        const errors = {};

        if (!toDoData.title) {
            errors.title = "Title is required";
        }

        if (typeof toDoData.title !== "string" || toDoData.title.trim() === "" || toDoData.title.length < 5) {
            errors.title = "Title should be at least 5 characters long, and should not be an empty string or string with just spaces";
        }

        if (!toDoData.description) {
            errors.description = "Description is required";
        }

        if (typeof toDoData.description !== "string" || toDoData.description.trim() === "" || toDoData.description.length < 25) {
            errors.description = "Description should be at least 25 characters long, and should not be an empty string or string with just spaces";
        }

        if (!toDoData.dueDate) {
            errors.dueDate = "Due date is required";
        } else {
            // Prevents dueDate from being set as one day earlier
            const dueDate = new Date(toDoData.dueDate.replace(/-/g, '\/'));
            const now = new Date();
            console.log(dueDate)
            console.log(now)
            console.log(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDay())
            console.log(now.getFullYear(), now.getMonth(), now.getDay())
            if (dueDate < now && !(now.getFullYear() === dueDate.getFullYear() &&
                now.getMonth() === dueDate.getMonth() &&
                now.getDate() === dueDate.getDate())) {
                errors.dueDate = 'Due date cannot be in the past';
            }
        }

        setToDoData((prevState) => ({ ...prevState, errors }));

        // Return true if there are no errors
        return Object.keys(errors).length === 0;
    };

    // https://www.telerik.com/blogs/react-basics-react-forms-examples#:~:text=Unlike%20HTML%2FJavaScript%2C%20React%20forms,used%20to%20update%20the%20DOM.
    const handleSubmit = (event) => {
        event.preventDefault();
        const validForm = validateForm();
        if (validForm) {
            toDoData.dueDate = new Date(toDoData.dueDate).toLocaleDateString();
            props.addTodo(toDoData.title, toDoData.description, toDoData.dueDate);
            setToDoData({
                title: "",
                description: "",
                dueDate: "",
                errors: {}
            })
        } else {
            console.log(Object.values(toDoData.errors));
        }
    }

    return (
        <div id="addToDo">
            <h1>Add Todo</h1>
            <form onSubmit={handleSubmit}>
                <label>Title:
                    <input type="text" name="title" value={toDoData.title} onChange={addTodo}/>
                    {toDoData.errors.title && (
                        <p style={{ color: "red" }}>{toDoData.errors.title}</p>
                    )}
                </label>
                <br/>
                <label>Description:
                    <input type="text" name="description" value={toDoData.description} onChange={addTodo}/>
                    {toDoData.errors.description && (
                        <p style={{ color: "red" }}>{toDoData.errors.description}</p>
                    )}
                </label>
                <br/>
                <label>Due Date:
                    {/* https://stackoverflow.com/questions/32378590/set-date-input-fields-max-date-to-today */}
                    <input type="date" name="dueDate" value={toDoData.dueDate} min={new Date().toISOString().split("T")[0]} onChange={addTodo}/>
                    {toDoData.errors.dueDate && (
                        <p style={{ color: "red" }}>{toDoData.errors.dueDate}</p>
                    )}
                </label>
                <br/>
                <button type={"submit"}>Add Todo</button>
            </form>
        </div>
    );
}

export default AddTodo;