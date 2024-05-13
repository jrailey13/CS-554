import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Searchbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const redirect = useNavigate();

  function handleChange(e) {
    setSearchTerm(e?.target?.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    redirect(`/search?term=${searchTerm}`);
  }

  return (
    <form
      className="absolute left-1/2 -translate-x-1/2"
      onSubmit={handleSubmit}
    >
      <div className="form-control">
        <div className="input-group">
          <label>
            <input
              id="search"
              className="input input-bordered"
              type="text"
              placeholder="Search…"
              onChange={handleChange}
            />
          </label>
          <button className="btn btn-square" type="submit">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </form>
  );
}
