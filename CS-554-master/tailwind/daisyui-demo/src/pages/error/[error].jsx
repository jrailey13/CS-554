import { useSearchParams, Link } from "react-router-dom";

import ErrorLayout from "./layout";

export default function Error() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code") || "404";

  return (
    <ErrorLayout>
      <h1 className="text-4xl">{code}</h1>
      {code === "400" ? (
        <>
          <p className="text-lg">Bad Request</p>
          <p>Looks like some of your inputs were invalid.</p>
        </>
      ) : code === "404" ? (
        <p className="text-lg">Not Found</p>
      ) : (
        <></>
      )}
      <Link className="underline" to="/">
        Go back
      </Link>
    </ErrorLayout>
  );
}
