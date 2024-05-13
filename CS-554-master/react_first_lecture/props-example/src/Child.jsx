function Child(props) {
  let myPTag = null;
  if (props.greeting) {
    myPTag = props.greeting;
  } else {
    myPTag = 'Greeting Not Passed in!';
  }
  return (
    <div>
      <p>Greeting from Child Component: {myPTag}</p>
    </div>
  );
}

export default Child;
