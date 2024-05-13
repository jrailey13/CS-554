import {useState, useEffect} from 'react';
import Head from 'next/head';
import {useRouter} from 'next/router';
import Image from 'next/image';
import styles from '@/styles/show.module.css';
export default function ShowCS() {
  const router = useRouter();
  const {id} = router.query;
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    if (router.isReady) {
      const {id} = router.query;
      if (!id) return null;
      fetch('http://api.tvmaze.com/shows/' + id)
        .then((res) => res.json())
        .then((data) => {
          console.log(`Fetched a show (CSF): ${data.name}`);
          setData(data);
          setLoading(false);
        });
    }
  }, [router.isReady, router.query]);

  //this useEffect has an issue when you refresh the page or manually enter a show ID. the useEffect above fixes this
  // useEffect(() => {
  //   fetch('http://api.tvmaze.com/shows/' + id)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setData(data);
  //       setLoading(false);
  //     });
  // }, [id]);

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>No show data</p>;

  return (
    <>
      <div>
        <Head>
          <title>{data.name}</title>
        </Head>
        <h1>{data.name} </h1>
        <p className={styles.showSummary}>
          {data.summary
            ? data.summary.replace(/(<([^>]+)>)/gi, '')
            : 'No Summary'}
        </p>
        <Image
          alt={data.name}
          src={
            data.image
              ? data.image.medium
              : 'https://patrickhill.nyc/images/me.jpg'
          }
          height={294}
          width={209}
        />
      </div>
    </>
  );
}
