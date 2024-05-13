import axios from 'axios';
import Link from 'next/link';
import Head from 'next/head';
export default function shows({data}) {
  return (
    <>
      <Head>
        <title>TV Shows (SSG)</title>
      </Head>
      <h1>Static Site Generation (SSG)</h1>
      <p>
        If a page uses Static Generation, the page HTML is generated at build
        time. That means in production, the page HTML is generated when you run
        next build. This HTML will then be reused on each request. It can be
        cached by a CDN.
      </p>
      <h2>Shows</h2>
      <ul>
        {data.map((show) => (
          <li key={show.id}>
            <Link href={`/static-site-generation/shows/${show.id}`}>
              {show.name}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

async function getShowData() {
  const {data} = await axios.get('http://api.tvmaze.com/shows');
  return data;
}
export async function getStaticProps() {
  const data = await getShowData();
  return {
    props: {data},
    revalidate: 86400
  };
}
