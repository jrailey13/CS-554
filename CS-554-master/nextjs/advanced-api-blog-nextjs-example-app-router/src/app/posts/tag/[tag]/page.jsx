import Link from 'next/link';
import {postData} from '@/data/index.js';
export const dynamic = 'force-dynamic';
import styles from './posts.module.css';
export default async function PostByTag({params}) {
  try {
    const data = await getData(params.tag);
    return (
      <div>
        <h1>Posts by Tag: {params.tag}</h1>
        <ul>
          {data.map((post) => {
            return (
              <li key={post._id.toString()}>
                <Link
                  className={styles.link}
                  href={`/posts/${post._id.toString()}`}
                >
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

  async function getData(tag) {
    const postList = await postData.getPostsByTag(tag);
    return postList;
  }
}
