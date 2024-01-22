import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../../redux/user/userSlice";
import OAuth from "../components/OAuth";

const options = (body) => ({
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body,
});

export default function SignTemplate({ isSigninPage }) {
  const [formData, setFormData] = useState({});
  const { isLoading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    dispatch(signInStart());

    try {
      const URL = `/api/auth/${isSigninPage ? "signin" : "signup"}`;
      const optionsObj = options(JSON.stringify(formData));

      // URL & options are outside the component for more cleaner and readable code
      const res = await fetch(URL, optionsObj);
      const data = await res.json();

      if (data.status.startsWith("s")) {
        dispatch(signInSuccess(data.data.user));
        navigate("/");
      } else {
        dispatch(signInFailure(data.message));
      }
    } catch (error) {
      console.log("Error From FrontEnd", error);
      dispatch(signInFailure());
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {!isSigninPage && (
          <input
            value={formData.username}
            id="username"
            className="border p-3 rounded-lg"
            type="text"
            placeholder="Username"
            onChange={handleChange}
          />
        )}
        <input
          value={formData.email}
          id="email"
          className="border p-3 rounded-lg"
          type="email"
          placeholder="Email"
          onChange={handleChange}
        />
        <input
          value={formData.password}
          id="password"
          className="border p-3 rounded-lg"
          type="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <button
          disabled={isLoading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {isLoading ? "Loading..." : isSigninPage ? "Sign in" : "Sign up"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>{isSigninPage ? "Dont have an account" : "Have an account?"}</p>
        <Link to={isSigninPage ? "/sign-up" : "/sign-in"}>
          <span className="text-blue-700">
            {isSigninPage ? "Sign up" : "Sign in"}
          </span>
        </Link>
      </div>
      {error ? error : null}
    </div>
  );
}
