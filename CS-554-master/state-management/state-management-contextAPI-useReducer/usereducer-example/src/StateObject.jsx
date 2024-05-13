import React, {useReducer} from 'react';
const intitalState = {
  firstCounter: 0,
  secondCounter: 10
};
const reducer = (state, action) => {
  const {type, payload} = action;
  switch (type) {
    case 'incrementFirstCounter':
      return {...state, firstCounter: state.firstCounter + payload.incBy};
    case 'decrementFirstCounter':
      return {...state, firstCounter: state.firstCounter - payload.decBy};
    case 'incrementSecondCounter':
      return {...state, secondCounter: state.secondCounter + payload.incBy};
    case 'decrementSecondCounter':
      return {...state, secondCounter: state.secondCounter - payload.decBy};
    case 'reset':
      return intitalState;
    default:
      return state;
  }
};
function StateObject() {
  const [count, dispatch] = useReducer(reducer, intitalState);
  return (
    <div>
      <div>Count One: {count.firstCounter}</div>

      <button
        onClick={() =>
          dispatch({type: 'incrementFirstCounter', payload: {incBy: 1}})
        }
      >
        Increment Counter One by 1
      </button>
      <br />
      <button
        onClick={() =>
          dispatch({type: 'decrementFirstCounter', payload: {decBy: 1}})
        }
      >
        Decrement Counter One by 1
      </button>
      <br />
      <button
        onClick={() =>
          dispatch({type: 'incrementFirstCounter', payload: {incBy: 5}})
        }
      >
        Increment Counter One by 5
      </button>
      <br />
      <button
        onClick={() =>
          dispatch({type: 'decrementFirstCounter', payload: {decBy: 5}})
        }
      >
        Decrement Counter One by 5
      </button>
      <br />
      <div>Count Two: {count.secondCounter}</div>
      <button
        onClick={() =>
          dispatch({type: 'incrementSecondCounter', payload: {incBy: 1}})
        }
      >
        Increment Counter Two by 1
      </button>
      <br />
      <button
        onClick={() =>
          dispatch({type: 'decrementSecondCounter', payload: {decBy: 1}})
        }
      >
        Decrement Counter Two by 1
      </button>
      <br />
      <button
        onClick={() =>
          dispatch({type: 'incrementSecondCounter', payload: {incBy: 5}})
        }
      >
        Increment Counter Two by 5
      </button>
      <br />
      <button
        onClick={() =>
          dispatch({type: 'decrementSecondCounter', payload: {decBy: 5}})
        }
      >
        Decrement Counter Two by 5
      </button>
      <br />
      <button onClick={() => dispatch({type: 'reset'})}>Reset</button>
    </div>
  );
}

export default StateObject;
