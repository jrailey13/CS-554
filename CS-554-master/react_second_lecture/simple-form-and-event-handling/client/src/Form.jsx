import React, {useState} from 'react';
import axios from 'axios';

function Form() {
  const [inputVal, setInputVal] = useState('');
  const [toggle, setToggle] = useState(false);
  const [postData, setPostData] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    let firstName = document.getElementById('firstName').value;
    let lastName = document.getElementById('lastName').value;

    //validation..

    let user = {
      firstName,
      lastName
    };

    const {data} = await axios.post('/api/users', user, {
      headers: {Accept: 'application/json'}
    });

    console.log(data);
    setPostData(data);
    alert(JSON.stringify(data));
    document.getElementById('firstName').value = '';
    document.getElementById('lastName').value = '';
  };

  return (
    <div>
      <form id='simple-form' onSubmit={handleSubmit}>
        <label>
          First Name:
          <input
            id='firstName'
            name='firstName'
            type='text'
            placeholder='First Name'
          />
        </label>
        <label>
          Last Name:
          <input
            id='lastName'
            name='lastName'
            type='text'
            placeholder='Last Name'
          />
        </label>

        <input type='submit' value='Submit' />
      </form>

      <br />
      <br />
      <h1>Toggle</h1>
      <button onClick={(e) => setToggle(!toggle)}>
        {toggle === true ? 'On' : 'Off'}
      </button>
      <br />
      <br />
      <h3>{inputVal}</h3>
      <label>
        Change State:
        <input
          id='chngState'
          name='chngState'
          type='text'
          placeholder='Change State by typing'
          onChange={(e) => setInputVal(e.target.value)}
        />
        <dl>
          <dt>{postData._id}</dt>
          <dt>{postData.firstName}</dt>
          <dt>{postData.lastName}</dt>
        </dl>
      </label>
    </div>
  );
}

export default Form;
