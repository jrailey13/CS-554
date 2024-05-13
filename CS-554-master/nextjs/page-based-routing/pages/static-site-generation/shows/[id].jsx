import axios from 'axios';
import Image from 'next/image';
import Head from 'next/head';
export default function show({data}) {
  return (
    <>
      <div>
        <Head>
          <title>{data.name}</title>
        </Head>
        <h1>{data.name} </h1>
        <p>
          {data.summary
            ? data.summary.replace(/(<([^>]+)>)/gi, '')
            : 'No Summary'}
        </p>

        <Image
          src={
            data.image
              ? data.image.medium
              : 'https://patrickhill.nyc/images/me.jpg'
          }
          height={294}
          width={209}
          alt={data.name}
        />
      </div>

      <style jsx>{`
        p::first-letter {
          font-size: 200%;
        }
        p {
          padding-bottom: 20px;
        }
      `}</style>
    </>
  );
}

export async function getStaticProps({params}) {
  const data = await getIndShowData(params.id);
  return {
    props: {data},
    revalidate: 86400
  };
}

async function getIndShowData(id) {
  const {data} = await axios.get('http://api.tvmaze.com/shows/' + id);
  console.log(`Fetched a show (getStaticProps): ${data.name}`);
  return data;
}

async function getShowData() {
  const {data} = await axios.get('http://api.tvmaze.com/shows');
  return data;
}
export async function getStaticPaths() {
  const data = await getShowData();
  const paths = data.map((show) => {
    return {
      params: {id: show.id.toString()}
    };
  });

  // console.log(JSON.stringify(paths));
  return {
    paths: paths,
    fallback: false
  };
}
