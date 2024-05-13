import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import _ from "lodash";

import { useEffect, useState } from "react";
import { useGetObjectsQuery } from "../../../store/services/museum";
import Card from "../../../components/Card";
import CollectionsLayout from "./layout";
import Pagination from "../../../components/Pagination";

export default function Collections() {
  const [loading, setLoading] = useState(true);
  const redirect = useNavigate();

  let { page } = useParams();
  page = +page;
  const [searchParams] = useSearchParams();
  const departmentIds = searchParams.get("departmentIds");

  // 400
  if (!_.isFinite(page) || page < 1) redirect(`/error?code=400`);
  if (!_.every(departmentIds?.split("|"), (id) => _.isFinite(+id)))
    redirect(`/error?code=400`);

  const { data, isLoading, isError, error } = useGetObjectsQuery({
    departmentIds,
    page,
  });

  if (isError) {
    redirect(`/error?code=${error.status}`);
  }

  if (!loading) {
    // 404
    if (page > data?.pages) redirect(`/error?code=404`);
    if (data?.length === 0) redirect(`/error?code=404`);
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
    <CollectionsLayout>
      <h1 className="text-4xl">Collections</h1>
      <Pagination
        page={page}
        maxPage={data?.pages}
        disabled={loading}
        departmentIds={departmentIds}
      />
      {loading ? (
        <>
          <p>Loading...</p>
          <span className="loading loading-spinner loading-lg mx-auto" />
        </>
      ) : (
        <div className="grid-auto-fit grid w-full gap-12 scroll-smooth">
          {data?.objects.map((obj) => {
            const img = [
              obj.primaryImage,
              obj.primaryImageSmall,
              ...obj.additionalImages,
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
                  {!obj?.artistDisplayName ? "Unknown" : obj.artistDisplayName}
                </p>
                <p>Date: {!obj.objectDate ? "Unknown" : obj.objectDate}</p>
                <p>
                  Department: {!obj.department ? "Unknown" : obj.department}
                </p>
              </Card>
            );
          })}
        </div>
      )}
    </CollectionsLayout>
  );
}
