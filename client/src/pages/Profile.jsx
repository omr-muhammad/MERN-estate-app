import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { Link, useNavigate } from "react-router-dom";

import { app } from "../firebase";
import {
  updateUserFailure,
  updateUserSuccess,
  updateUserStart,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  userAuthStart,
  userAuthFailure,
  userAuthSuccess,
} from "../../redux/user/userSlice";

export default function Profile() {
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [successUpdate, setSuccessUpdate] = useState(false);
  const [showErrorListing, setShowListingsError] = useState(null);
  const [userListings, setUserListings] = useState([]);
  const { loading, error, currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    function handleFileUpload() {
      const storage = getStorage(app);
      const fileName = new Date().getTime + currentUser.id + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setFilePerc(Math.round(progress));
        },
        (/* error */) => {
          setFileUploadError(true);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
            setFormData((prev) => ({ ...prev, avatar: downloadURL }))
          );
        }
      );
    }

    if (file) {
      handleFileUpload();
    }
  }, [file, currentUser.id]);

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      dispatch(updateUserStart());

      const res = await fetch(`/api/user/updateMe/${currentUser._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!data.status.startsWith("s")) {
        throw new Error(data.message);
      }

      dispatch(updateUserSuccess(data.data.user));
      setSuccessUpdate(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  async function handleDelete() {
    dispatch(deleteUserStart());
    try {
      const res = await fetch(`/api/user/deleteMe/${currentUser._id}`, {
        method: "DELETE",
      });

      if (res.status === 204) {
        dispatch(deleteUserSuccess());
      } else {
        const data = res.json();
        throw new Error(data.message);
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
      console.log("Error", error);
    } finally {
      navigate("/sign-in");
    }
  }

  async function handleSignout() {
    dispatch(userAuthStart());

    try {
      const res = await fetch("/api/auth/signout");

      if (res.status !== 200) {
        throw new Error(`Error Signing out`);
      }
      dispatch(userAuthSuccess(null));
    } catch (error) {
      dispatch(userAuthFailure(error.message));
    } finally {
      navigate("/sign-in");
    }
  }

  async function handleShowListings() {
    try {
      setShowListingsError(null);
      const res = await fetch(`/api/user/${currentUser._id}/listings`);
      const data = await res.json();
      if (!data.status.startsWith("s")) {
        setShowListingsError("Sorry There Is an Error Showing Listings.");
        return;
      }

      if (data.data.listings.length === 0) {
        setShowListingsError(`You don&apos;t have listings`);
        return;
      }
      setUserListings(data.data.listings);
    } catch (error) {
      setShowListingsError("Sorry There Is an Error Showing Listings.");
    }
  }

  async function handleListingDelete(id) {
    try {
      const res = await fetch(`/api/listing/${id}`, {
        method: "DELETE",
      });

      if (res.status !== 204) {
        const data = await res.json();
        console.log(data);
        return;
      }

      setUserListings((prev) => prev.filter((listing) => listing._id !== id));
    } catch (error) {
      console.log(error.message);
    }
  }
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          id="image_file"
          ref={fileRef}
          hidden
          onChange={(e) => setFile(e.target.files[0])}
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="Avatar"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        {!fileUploadError ? (
          <p className="text-sm self-center">
            {filePerc > 0 && filePerc < 100 ? (
              <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
            ) : filePerc === 100 ? (
              <span className="text-green-700">
                Image successfully uploaded!
              </span>
            ) : (
              ""
            )}
          </p>
        ) : (
          <span className="text-red-700">
            Error Image upload (image must be less than 2 mb)
          </span>
        )}
        <input
          type="text"
          placeholder="username"
          defaultValue={currentUser.username}
          id="username"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="email"
          defaultValue={currentUser.email}
          id="email"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading" : "update"}
        </button>
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
          to={"/create-listing"}
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDelete} className="text-red-700 cursor-pointer">
          Delete account
        </span>
        <span onClick={handleSignout} className="text-red-700 cursor-pointer">
          Sign out
        </span>
      </div>

      {successUpdate ? (
        <p className="text-green-700 mt5">User was successfully updated</p>
      ) : null}
      {error ? <p className="text-red-700 mt-5">{error}</p> : null}
      {
        <button onClick={handleShowListings} className="text-green-700 w-full">
          Show Listings
        </button>
      }
      {showErrorListing && (
        <p className="text-red-700 mt-5">{showErrorListing}</p>
      )}
      {userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div key={listing._id}>
              <Link
                to={`/listing/${listing._id}`}
                className="border rounded-lg p-3 flex justify-between items-center gap-4"
              >
                <img
                  src={listing.imgUrls[0]}
                  alt="listing cover"
                  className="h-16 w-16 object-contain"
                />
                <p
                  className="text-slate-700 font-semibold  hover:underline truncate flex-1"
                  to={`/listing/${listing._id}`}
                >
                  <span>{listing.name}</span>
                </p>

                <div className="flex flex-col items-center">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleListingDelete(listing._id);
                    }}
                    className="text-red-700 uppercase"
                  >
                    Delete
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      history.push(`/update-listing/${listing._id}`);
                    }}
                    className="text-green-700 uppercase"
                  >
                    Edit
                  </button>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
