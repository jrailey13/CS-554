import PropsExample from './PropsExample';

function App() {
  const greeting = 'Hello Function Components!';

  const handle_child_click = (name) => {
    console.log(`Hello ${name} from within the handle_child_click in app.jsx`);
  };

  return (
    <div>
      <PropsExample
        user={{name: 'Patrick Hill', username: 'GraffixNYC'}}
        handleClick={handle_child_click}
        greeting={greeting}
      />

      <PropsExample
        user={{name: 'Aiden Hill', username: 'AidenHill'}}
        handleClick={handle_child_click}
      />
    </div>
  );
}

export default App;
