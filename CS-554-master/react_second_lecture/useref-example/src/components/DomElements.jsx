import {useRef, useState} from 'react';

function DomElements() {
  const [inputVal, setInputVal] = useState('');
  const inputElement = useRef();

  const focusInput = () => {
    inputElement.current.focus();
  };

  const inputChange = () => {
    setInputVal(inputElement.current.value);
  };

  return (
    <>
      <input type='text' ref={inputElement} onChange={inputChange} />
      <button onClick={focusInput}>Focus Input</button>
      <h2>Input Value:</h2>
      {inputVal}
    </>
  );
}

export default DomElements;
