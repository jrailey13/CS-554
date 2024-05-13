import React, {useState, useCallback} from 'react';
let funCount = new Set();

function Callback(props) {
  const [count, setCount] = useState(0);
  const [number, setNumber] = useState(0);

  const incrementCounter = useCallback(() => {
    setCount((count) => count + 1);
  }, [count]);

  const decrementCounter = useCallback(() => {
    setCount((count) => count - 1);
  }, [count]);

  const incrementNumber = useCallback(() => {
    setNumber((number) => number + 1);
  }, [number]);

  funCount.add(incrementCounter);
  funCount.add(decrementCounter);
  funCount.add(incrementNumber);
  console.log('useCallback:', funCount.size);

  return (
    <div>
      <div>useCallback Count: {count}</div>

      <div>useCallback Number: {number}</div>

      <button onClick={incrementCounter}> Increase Counter</button>
      <button onClick={decrementCounter}> Decrease Counter</button>
      <button onClick={incrementNumber}> Increase Number</button>
    </div>
  );
}

export default Callback;
