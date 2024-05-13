import React, {useEffect, useRef, useState} from 'react';
import io from 'socket.io-client';
import './App.css';
import Chat from './Chat';

function App() {
  const [state, setState] = useState({message: '', name: ''});
  const [chat, setChat] = useState([]);

  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io('http://localhost:4000');
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    socketRef.current.on('message', ({name, message}) => {
      console.log('The server has broadcast message data to all clients');
      setChat([...chat, {name, message}]);
    });
    socketRef.current.on('user_join', function (data) {
      console.log('The server has broadcast user join event to all clients');
      setChat([
        ...chat,
        {name: 'ChatBot', message: `${data} has joined the chat`}
      ]);
    });

    return () => {
      socketRef.current.off('message');
      socketRef.current.off('user_join');
    };
  }, [chat]);

  const userjoin = (name) => {
    console.log('Going to send the user join event to the server');
    socketRef.current.emit('user_join', name);
  };

  const onMessageSubmit = (e) => {
    let msgEle = document.getElementById('message');
    console.log([msgEle.name], msgEle.value);
    setState({...state, [msgEle.name]: msgEle.value});
    console.log('Going to send the message event to the server');
    socketRef.current.emit('message', {
      name: state.name,
      message: msgEle.value
    });
    e.preventDefault();
    setState({message: '', name: state.name});
    msgEle.value = '';
    msgEle.focus();
  };

  return (
    <div>
      {state.name && (
        <div className='card'>
          <div className='render-chat'>
            <h1>Chat Log</h1>
            <Chat chat={chat} />
          </div>
          <form className='chatform' onSubmit={onMessageSubmit}>
            <input
              name='message'
              id='message'
              variant='outlined'
              label='Message'
              autoFocus
            />

            <button>Send Message</button>
          </form>
        </div>
      )}

      {!state.name && (
        <form
          className='usernameform'
          onSubmit={(e) => {
            console.log(document.getElementById('username_input').value);
            e.preventDefault();
            setState({name: document.getElementById('username_input').value});
            userjoin(document.getElementById('username_input').value);
            // userName.value = '';
          }}
        >
          <div className='form-group'>
            <label>
              User Name:
              <br />
              <input id='username_input' />
            </label>
          </div>
          <br />

          <br />
          <br />
          <button type='submit'> Click to join</button>
        </form>
      )}
    </div>
  );
}

export default App;
