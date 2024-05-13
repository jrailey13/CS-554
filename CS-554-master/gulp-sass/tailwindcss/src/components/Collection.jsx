import { Link } from "react-router-dom";

import Card from "./Card";
import getMarvelAPI from "../utils/getMarvelAPI";

export default function Collection({ data }) {
  const characters = data?.results;
  console.log("characters", characters);

  return (
    <div className="grid-auto-fit grid w-full gap-12">
      {characters &&
        characters.map((character) => {
          const url_split = character.resourceURI.split("/");
          const url = url_split[url_split.length - 1];

          return (
            <Card>
              <h2 className="text-2xl">{character.name}</h2>
              <p>{character.description}</p>
              <Link to={url} className="btn">
                View Character
              </Link>
            </Card>
          );
        })}
    </div>
  );
}
