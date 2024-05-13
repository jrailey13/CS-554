import AllTodos from './AllTodos';
import AllUsers from './AllUsers';
const All = () => {
  return (
    <div className='all'>
      <h2 id='heading'>All State</h2>
      <AllTodos />
      <hr />
      <AllUsers />
      <br />
      <br />
    </div>
  );
};

export default All;
