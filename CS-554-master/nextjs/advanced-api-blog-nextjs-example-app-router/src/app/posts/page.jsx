import Link from 'next/link';
import styles from './posts.module.css';
import {postData} from '@/data/index.js';

export const metadata = {
  title: 'Posts'
};
//export const dynamic = 'force-dynamic';
export default async function Posts() {
  try {
    const data = await getData();
    return (
      <div>
        <ul>
          {data.map((post) => {
            return (
              <li key={post._id}>
                <Link className={styles.link} href={`/posts/${post._id}`}>
                  {post.title}
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
  const postList = await postData.getAllPosts();
  return postList;
}
