import { Link } from "react-router-dom";

import Card from "./Card";

export default function Collection({ data }) {
  const characters = data?.results;

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
              <Link to={url} className="btn hover:bg-blue-700">
                View Character
              </Link>
            </Card>
          );
        })}
    </div>
  );
}
