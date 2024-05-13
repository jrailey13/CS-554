import { Link } from "react-router-dom";

import HomeLayout from "./layout";

export default function Home() {
  return (
    <HomeLayout>
      <div className="hero bg-base-200 flex-grow">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Hello there</h1>
            <p className="py-6">
              Take a gander at all the awesome things that the Met Museum has to
              offer.
            </p>
            <Link className="btn btn-primary" to="collection/page/1">
              See Collections
            </Link>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}
