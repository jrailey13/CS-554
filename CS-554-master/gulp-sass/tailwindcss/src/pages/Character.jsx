import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import getMarvelAPI from "../utils/getMarvelAPI";
import Card from "../components/Card";

export default function Character() {
  const id = useParams().characterId;
  const [data, setData] = useState(null);

  useEffect(() => {
    const url = getMarvelAPI("characters/" + id);

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
      <Card>
        {console.log(data)}
        <h2 className="text-2xl">{data?.results[0].name}</h2>
        <img
          className="w-1/4"
          src={
            data?.results[0].thumbnail.path +
            "." +
            data?.results[0].thumbnail.extension
          }
        />
        <p>{data?.results[0].description}</p>
      </Card>
    </main>
  );
}
