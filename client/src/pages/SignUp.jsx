import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const URL = "/api/auth/signup";
const options = (body) => ({
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body,
});

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const optionsObj = options(JSON.stringify(formData));

      // URL & options are outside the component for more cleaner and readable code
      const res = await fetch(URL, optionsObj);
      const data = await res.json();

      if (data.status.startsWith("s")) {
        setError("");
        navigate("/sign-in");
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.log("Error From FrontEnd", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  console.log(formData);
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          value={formData.username}
          id="username"
          className="border p-3 rounded-lg"
          type="text"
          placeholder="Username"
          onChange={handleChange}
        />
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
          {isLoading ? "Loading..." : "Sign up"}
        </button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to="/sign-in">
          <span className="text-blue-700">Sign in</span>
        </Link>
      </div>
      {error ? error : null}
    </div>
  );
}
