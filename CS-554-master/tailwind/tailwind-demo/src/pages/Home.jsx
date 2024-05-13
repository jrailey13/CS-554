import { useEffect, useState } from "react";
import axios from "axios";

import getMarvelAPI from "../utils/getMarvelAPI";
import Collection from "../components/Collection";

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const url = getMarvelAPI("characters");

    (async () => {
      try {
        const { data } = await axios.get(url);
        setData(data?.data);
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  return (
    <main className="m-32 space-y-8">
      <h1 className="text-center text-4xl">
        Hello, welcome to Jackey's Marvel collection!
      </h1>
      <Collection data={data} />
    </main>
  );
}
