import { useParams, useNavigate } from "react-router-dom";
import _ from "lodash";

import { useGetObjectByIdQuery } from "../../store/services/museum";
import CollectionLayout from "./layout";
import Card from "../../components/Card";

export default function Collection() {
  let { id } = useParams();
  const redirect = useNavigate();

  if (!_.isFinite(+id) || +id < 0) redirect(`/error?code=400`);

  const {
    data: obj,
    isLoading,
    isError,
    error,
  } = useGetObjectByIdQuery({ id });

  if (isError) {
    redirect(`/error?code=${error.status}`);
  }

  if (!isLoading) {
    // 404
    if (!obj) redirect(`/error?code=404`);
  }

  return (
    <CollectionLayout>
      {isLoading && !obj ? (
        <>
          <p>Loading...</p>
          <span className="loading loading-spinner loading-lg mx-auto" />
        </>
      ) : (
        <Card
          key={obj.objectID}
          base={{
            id: obj.objectID,
            title: obj.title,
            img: [
              obj.primaryImage,
              obj.primaryImageSmall,
              ...obj.additionalImages,
            ].filter((img) => img !== "" && img !== undefined),
            date: obj.objectDate,
            isHighlight: obj.isHighlight,
            link: obj.objectURL,
          }}
        >
          <span>
            <h3 className="text-lg">Author Information</h3>
            <p>
              {!obj?.artistDisplayName ? "Unknown" : obj.artistDisplayName} |
              Gender: {!obj.artistGender ? "Unknown" : obj.artistGender}
            </p>
            <p>{!obj.artistDisplayBio ? "Unknown" : obj.artistDisplayBio}</p>
            <p></p>
          </span>
          <span>
            <h3 className="text-lg">Object Information</h3>
            <p>Date: {!obj.objectDate ? "Unknown" : obj.objectDate}</p>
            <p>Department: {!obj.department ? "Unknown" : obj.department}</p>
            <p> Medium: {!obj.medium ? "Unknown" : obj.medium}</p>
            <p>Culture: {!obj.culture ? "Unknown" : obj.culture}</p>
            <p>
              Classification:{" "}
              {!obj.classification ? "Unknown" : obj.classification}
            </p>
            <p>
              Dimensions:{" "}
              {!obj.dimensions || typeof obj?.dimensions === "object"
                ? "Unknown"
                : obj.dimensions}
            </p>
          </span>
        </Card>
      )}
    </CollectionLayout>
  );
}
