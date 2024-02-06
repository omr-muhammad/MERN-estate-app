import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromURL = urlParams.get("searchTerm");

    if (searchTermFromURL) {
      setSearchTerm(searchTermFromURL);
    }
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-100 p-3 rounded-lg flex items-center"
    >
      <input
        type="text"
        placeholder="Search..."
        className="bg-transparent focus:outline-none w-24 sm:w-64"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button>
        <FaSearch className="text-slate-600" />
      </button>
    </form>
  );
}
