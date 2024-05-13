import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import _ from "lodash";

import SearchPageLayout from "./layout";
import { useSearchObjectsQuery } from "../../../store/services/museum";
import Card from "../../../components/Card";

export default function SearchPage() {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("term");
  const redirect = useNavigate();

  if (!_.isFinite(page) || page < 1) redirect(`/error?code=400`);

  const { data, isLoading, isError, error } = useSearchObjectsQuery({
    query: searchTerm,
    page: +page,
  });
  // 400

  if (isError) {
    console.log(error);
    redirect(`/error?code=${error.status}`);
  }

  if (!loading) {
    // 404
    if (page > data?.pages) redirect(`/error?code=404`);
    if (data?.length === 0) redirect(`/error?code=404`);
  }

  if (isError) {
    redirect(`/error?code=${error.status}`);
  }

  if (!isLoading) {
    // 404
    if (data?.length === 0) redirect(`/error?code=404`);
  }

  function handlePageChange(prevNext) {
    setPage(page + prevNext);
  }

  useEffect(() => {
    setLoading(true);
  }, [page]);

  useEffect(() => {
    if (!isLoading) {
      setLoading(false);
    }
  }, [data]);

  return (
    <SearchPageLayout>
      {loading && !data ? (
        <>
          <p>Loading...</p>
          <span className="loading loading-spinner loading-lg mx-auto" />
        </>
      ) : (
        <>
          <h1 className="text-4xl">Search results for "{searchTerm}"</h1>
          <div className="join">
            <button
              onClick={() => handlePageChange(-1)}
              className={
                "join-item btn" +
                (page > 1 && !isLoading ? "" : " btn-disabled")
              }
            >
              «
            </button>
            <button className="join-item btn">
              {page} of {data.pages || "..."}
            </button>
            <button
              onClick={() => handlePageChange(1)}
              className={
                "join-item btn" +
                (page !== data.pages && !isLoading ? "" : " btn-disabled")
              }
            >
              »
            </button>
          </div>
          <div className="grid-auto-fit grid w-full gap-12 scroll-smooth">
            {data?.objects.map((obj) => {
              const img = [
                obj.primaryImage,
                obj.primaryImageSmall,
                ...(obj.additionalImages ?? []),
              ].filter((img) => img !== "" && img !== undefined);

              return (
                <Card
                  key={obj.objectID}
                  base={{
                    id: obj.objectID,
                    title: obj.title,
                    img,
                    date: obj.objectDate,
                    isHighlight: obj.isHighlight,
                  }}
                >
                  <p>
                    Author:{" "}
                    {!obj?.artistDisplayName
                      ? "Unknown"
                      : obj.artistDisplayName}
                  </p>
                  <p>Date: {!obj.objectDate ? "Unknown" : obj.objectDate}</p>
                  <p>
                    Department: {!obj.department ? "Unknown" : obj.department}
                  </p>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </SearchPageLayout>
  );
}
