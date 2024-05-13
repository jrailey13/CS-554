import {useState, useEffect} from 'react';
import Link from 'next/link';
import Head from 'next/head';
export default function ShowsCS() {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://api.tvmaze.com/shows')
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>No show data</p>;

  return (
    <div>
      <Head>
        <title>TV Shows (CSF)</title>
      </Head>
      <h1>Client-Side Fetching (CSF)</h1>
      <p>
        Client-side data fetching is useful when your page doesn't require SEO
        indexing, when you don't need to pre-render your data, or when the
        content of your pages needs to update frequently. Unlike the server-side
        rendering APIs, you can use client-side data fetching at the component
        level. If done at the page level, the data is fetched at runtime, and
        the content of the page is updated as the data changes. When used at the
        component level, the data is fetched at the time of the component mount,
        and the content of the component is updated as the data changes. It's
        important to note that using client-side data fetching can affect the
        performance of your application and the load speed of your pages. This
        is because the data fetching is done at the time of the component or
        pages mount, and the data is not cached.
      </p>
      <h1>Shows</h1>
      <ul>
        {data.map((show) => {
          return (
            <li key={show.id}>
              <Link href={`/client-side-fetching-useeffect/shows/${show.id}`}>
                {show.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
