export default function Carousel({ images = [], id }) {
  return (
    <div className="carousel bg-base-200 relative w-full">
      {images?.length > 0 ? (
        images.map((img, i) => {
          i++;

          return (
            <div
              key={i}
              id={`item${id}:${i}`}
              className="carousel-item relative w-full"
            >
              <img src={img} alt={img} className="mx-auto h-80 w-auto" />
              <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                <a
                  href={`#item${id}:${i === 1 ? i + images.length - 1 : i - 1}`}
                  className="btn btn-circle"
                >
                  ❮
                </a>
                <a
                  href={`#item${id}:${
                    i === images.length ? i - images.length + 1 : i + 1
                  }`}
                  className="btn btn-circle"
                >
                  ❯
                </a>
              </div>
            </div>
          );
        })
      ) : (
        <div id="NA" className="carousel-item w-full justify-center">
          <img
            src="/NoImageAvailableIcon.png"
            alt="no image available"
            className="h-80 w-auto"
          />
        </div>
      )}
    </div>
  );
}
