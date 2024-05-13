import {postData} from '@/data/index.js';
import Link from 'next/link';
import styles from './postdetails.module.css';
export default async function PostById({params}) {
  try {
    const data = await getData(params.id);
    return (
      <div>
        <h1>{data.title}</h1>
        <p>{data.body}</p>
        {data.tags.length > 0 ? (
          <div>
            <br />
            <h3>Tags:</h3>
            <ul>
              {data.tags &&
                data.tags.map((tag) => {
                  return (
                    <li key={tag}>
                      <Link
                        className={styles.userPostLi}
                        href={`/posts/tag/${tag}`}
                      >
                        {tag}
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </div>
        ) : (
          <div></div>
        )}
        <br />
        <br />
        <cite>
          <Link
            className={styles.userPostLi}
            href={`/users/${data.poster._id.toString()}`}
          >
            By: {data.poster.firstName} {data.poster.lastName}
          </Link>
          <br />
          Post ID: {data._id.toString()}
        </cite>
      </div>
    );
  } catch (e) {
    return <div>{e}</div>;
  }

  async function getData(id) {
    const post = await postData.getPostById(id);
    return post;
  }
}
