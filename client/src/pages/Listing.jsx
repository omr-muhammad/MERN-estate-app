import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { listingID } = useParams();

  useEffect(() => {
    async function getListing() {
      try {
        const res = await fetch(`/api/listing/${listingID}`);
        const data = await res.json();

        if (!data.status.startsWith("s")) {
          console.log(data);
          setError("Something Went Wrong");
        }

        setListing(data.data.listing);
      } catch (error) {
        console.log(error);
        setError("Something Went Wrong");
      } finally {
        setIsLoading(false);
      }
    }

    getListing();
  }, [listingID]);

  return (
    <main>
      {isLoading ? (
        <p className="text-center my-7 text-2xl">Loading...</p>
      ) : error ? (
        <p className="text-center my-7 text-2xl">{error}</p>
      ) : (
        <>
          <Swiper navigation>
            {listing.imgUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      )}
    </main>
  );
}
