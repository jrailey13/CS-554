import { Link } from "react-router-dom";
import Carousel from "./Carousel";

export default function Card({ base, children }) {
  return (
    <div className="card card-compact bg-base-100 shadow-base-300 w-96 shadow-lg">
      <figure className="flex-col">
        <Carousel images={base.img} id={base.id} />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {base.title}
          {base.isHighlight ? (
            <div className="badge badge-secondary">Featured</div>
          ) : (
            <></>
          )}
        </h2>
        {children}
        <div className="card-actions justify-end">
          {base.link ? (
            <a href={base.link} target="blank" className="btn btn-secondary">
              View on Met Museum
            </a>
          ) : (
            <Link to={`/collection/${base.id}`} className="btn btn-primary">
              View Item
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
