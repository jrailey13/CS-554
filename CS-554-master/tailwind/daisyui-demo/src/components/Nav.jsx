import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { setTheme } from "../store/theme.slice";
import Searchbar from "./Searchbar";

export default function Nav() {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);

  const changeTheme = () => {
    dispatch(setTheme(theme === "forest" ? "fantasy" : "forest"));
  };

  return (
    <nav className="flex h-auto w-full items-center justify-between p-4">
      <Link to="/" className="text-4xl">
        Explorer
      </Link>
      <Searchbar />
      <input
        type="checkbox"
        className="toggle"
        onChange={changeTheme}
        checked={theme === "fantasy"}
      />
    </nav>
  );
}
