import React, {useState} from 'react';
let funCount = new Set();

function NoCallback(props) {
  const [count, setCount] = useState(0);
  const [number, setNumber] = useState(0);

  const incrementCounter = () => {
    setCount((count) => count + 1);
  };

  const decrementCounter = () => {
    setCount((count) => count - 1);
  };

  const incrementNumber = () => {
    setNumber((number) => number + 1);
  };
  funCount.add(incrementCounter);
  funCount.add(decrementCounter);
  funCount.add(incrementNumber);
  console.log('NO useCallback:', funCount.size);

  return (
    <div>
      <div>No Callback Count: {count}</div>

      <div>No Callback Number: {number}</div>

      <button onClick={incrementCounter}> Increase Counter</button>
      <button onClick={decrementCounter}> Decrease Counter</button>
      <button onClick={incrementNumber}> Increase Number</button>
    </div>
  );
}

export default NoCallback;
