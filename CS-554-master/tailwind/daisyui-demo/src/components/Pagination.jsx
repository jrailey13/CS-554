import { Link } from "react-router-dom";

export default function Pagination({ page, maxPage, disabled, departmentIds }) {
  return (
    <div className="join">
      <Link
        to={`../${page - 1}${
          departmentIds ? `?departmentIds=${departmentIds}` : ""
        }`}
        relative="path"
        className={
          "join-item btn" + (page > 1 && !disabled ? "" : " btn-disabled")
        }
      >
        «
      </Link>
      <button className="join-item btn">
        {page} of {maxPage || "..."}
      </button>
      <Link
        to={`../${page + 1}${
          departmentIds ? `?departmentIds=${departmentIds}` : ""
        }`}
        relative="path"
        className={
          "join-item btn" +
          (page !== maxPage && !disabled ? "" : " btn-disabled")
        }
      >
        »
      </Link>
    </div>
  );
}
