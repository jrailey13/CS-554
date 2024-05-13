import Link from 'next/link';
export default function Home() {
  return (
    <div>
      <p>
        To seed the database you can make a GET request to
        <a
          target='_blank'
          className='seedLink'
          href={'http://localhost:3000/api/seed'}
        >
          http://localhost:3000/api/seed
        </a>
      </p>
      <br />
      <p>
        This uses NEXTJS. This application is a combination of Lecture 6 and
        Lecture 8's code from CS 546. There are two parts to this application.
        the API, which can interact with the database with JSON and a REST API
        Client like Postman (like lecture 6 from 546). <br />
        <br />
        The API can be accessed via the following routes using POSTMAN:
      </p>
      <ul>
        <li> GET http://localhost:3000/api/posts</li>
        <li> GET http://localhost:3000/api/posts/:id</li>
        <li> GET http://localhost:3000/api/posts/tag/:tag</li>
        <li> GET http://localhost:3000/api/users</li>
        <li> GET http://localhost:3000/api/users/:id</li>
        <li> POST http://localhost:3000/api/posts</li>
        <li> POST http://localhost:3000/api/users</li>
        <li> POST http://localhost:3000/api/posts/tag/rename</li>
        <li> PUT http://localhost:3000/api/posts/:id</li>
        <li> PATCH http://localhost:3000/api/posts/:id</li>
        <li> DELETE http://localhost:3000/api/posts/:id</li>
        <li> PUT http://localhost:3000/api/users/:id</li>
        <li> PATCH http://localhost:3000/api/users/:id</li>
        <li> DELETE http://localhost:3000/api/users/:id</li>
      </ul>
      <br />
      <br />
      <p>
        The other part of the application is using this UI (The UI Mimics 546's
        Lecture 8 code)
      </p>
      <p>
        The UI components do not call the API but directly call the MongoDB data
        access functions with exception of the Add Post and Add User forms,
        which are client side forms, that call server side actions.. (This is
        not something you can do with normal React!).
      </p>

      <p>
        The API is independent of the UI. Meaning, the UI does not rely on the
        API to function with exception of the Add Post form which uses a
        useEffect (since it's a client form) to pull the list of users from the
        DB and populate the poster dropdown.
      </p>
    </div>
  );
}
