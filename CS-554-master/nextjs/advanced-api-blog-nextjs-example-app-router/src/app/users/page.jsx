import Link from 'next/link';
import styles from './users.module.css';
import {userData} from '@/data/index.js';
//export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Users'
};
export default async function Posts() {
  try {
    const userList = await getData();
    return (
      <div>
        <ul>
          {userList.map((user) => {
            return (
              <li key={user._id}>
                <Link className={styles.link} href={`/users/${user._id}`}>
                  {user.firstName} {user.lastName}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  } catch (e) {
    return <div>{e}</div>;
  }
}

async function getData() {
  const userList = await userData.getAllUsers();
  return userList;
}
