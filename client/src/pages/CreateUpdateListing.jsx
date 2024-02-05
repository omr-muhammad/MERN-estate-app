import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

const initFormData = {
  imgUrls: [],
  name: "",
  description: "",
  address: "",
  type: "rent",
  bedrooms: 0,
  bathrooms: 0,
  regularPrice: 50,
  discountPrice: 0,
  offer: false,
  parking: false,
  furnished: false,
};

async function storeImage(file) {
  return new Promise((resolve, reject) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      }
    );
  });
}

export default function CreateUpdateListing({ isUpdate }) {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState(initFormData);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((store) => store.user);
  const navigate = useNavigate();
  const { listingID } = useParams();

  useEffect(() => {
    async function getDataFromDB() {
      const res = await fetch(`/api/listing/${listingID}`);
      const data = await res.json();

      if (!data.status.startsWith("s")) {
        setError(data.message);
      }

      setFormData(data.data.listing);
    }

    if (isUpdate) {
      getDataFromDB();
    }
  }, [isUpdate, listingID]);

  function handleImageUpload() {
    if (files.length > 0 && files.length < 7) {
      setIsUploading(true);
      const promisesImg = [];

      for (let i = 0; i < files.length; i++) {
        promisesImg.push(storeImage(files[i]));
      }

      Promise.all(promisesImg)
        .then((url) => {
          setFormData((prev) => ({
            ...prev,
            imgUrls: formData.imgUrls.concat(url),
          }));
          setImageUploadError(null);
          setIsUploading(false);
        })
        .catch((err) => {
          console.log(err);
          setImageUploadError("Image upload failed (2 mb max for image)");
          setIsUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing");
    }
  }

  function handleRemoveImage(i) {
    setFormData((prev) => ({
      ...prev,
      imgUrls: prev.imgUrls.filter((img, index) => index !== i),
    }));
  }

  function handleChange(e) {
    const types = ["rent", "sale"];
    const truthyFalsy = ["offer", "parking", "furnished"];

    if (types.includes(e.target.id)) {
      setFormData((prev) => ({ ...prev, type: e.target.id }));
    } else if (truthyFalsy.includes(e.target.id)) {
      setFormData((prev) => ({ ...prev, [e.target.id]: !prev[e.target.id] }));
    } else setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (formData.imgUrls.length < 1)
      return setError("You should at least upload one image.");

    if (+formData.regularPrice < +formData.discountPrice)
      return setError("Discount price must be less than regular price.");

    setIsLoading(true);
    try {
      const res = await fetch(`/api/listing/${isUpdate ? listingID : ""}`, {
        method: isUpdate ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();

      if (!data.status.startsWith("s")) {
        setError(data.message);
      }

      navigate(`/listing/${data.data.listing._id}`);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
            value={formData.name}
            onChange={handleChange}
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            value={formData.description}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
            value={formData.address}
            onChange={handleChange}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                checked={formData.type === "sale"}
                onChange={handleChange}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                checked={formData.type === "rent"}
                onChange={handleChange}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                checked={formData.parking}
                onChange={handleChange}
              />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                checked={formData.furnished}
                onChange={handleChange}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                checked={formData.offer}
                onChange={handleChange}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                value={formData.bedrooms}
                onChange={handleChange}
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                value={formData.bathrooms}
                onChange={handleChange}
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="50"
                max="10000000"
                required
                className="p-3 border border-gray-300 rounded-lg"
                value={formData.regularPrice}
                onChange={handleChange}
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                {formData.type === "rent" && (
                  <span className="text-xs">($ / month)</span>
                )}
              </div>
              {formData.offer && (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    id="discountPrice"
                    min="0"
                    max="10000000"
                    required
                    className="p-3 border border-gray-300 rounded-lg"
                    value={formData.discountPrice}
                    onChange={handleChange}
                  />
                  <div className="flex flex-col items-center">
                    <p>Discounted price</p>
                    {formData.type === "rent" && (
                      <span className="text-xs">($ / month)</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              disabled={isUploading || files.length <= 0}
              onClick={handleImageUpload}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80 disabled:cursor-not-allowed"
            >
              {isUploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          {imageUploadError && (
            <p className="text-red-700 text-sm">{imageUploadError}</p>
          )}
          {formData.imgUrls.length > 0 &&
            formData.imgUrls.map((url, i) => (
              <div
                key={url}
                className="flex justify-between p-3 border items-center"
              >
                <img
                  src={url}
                  alt="listing image"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(i)}
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={isLoading || isUploading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {isLoading
              ? isUpdate
                ? "Updating"
                : "Creating..."
              : isUpdate
              ? "Update Listing"
              : "Create listing"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
