import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { setTheme } from "./store/theme.slice";
import Home from "./pages/page";
import Collections from "./pages/collection/page/[page]";
import Collection from "./pages/collection/[id]";
import SearchPage from "./pages/collection/search/[searchTerm]";
import Error from "./pages/error/[error]";

function App() {
  const dispatch = useDispatch();
  const localTheme = localStorage.getItem("theme");
  const { theme } = useSelector((state) => state.theme);

  if (localTheme && localTheme !== theme) {
    dispatch(setTheme(localTheme));
  }

  return (
    <div
      data-theme={theme}
      className="bg-base-100 text-base-content min-h-[100vh] p-8"
    >
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/collection/page/:page" Component={Collections} />
        <Route path="/collection/:id" Component={Collection} />
        <Route path="/search" Component={SearchPage} />
        <Route path="/error" Component={Error} />
        <Route path="*" Component={Error} />
      </Routes>
    </div>
  );
}

export default App;
