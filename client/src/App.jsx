import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Header from "./components/Header";
import SignTemplate from "./pages/SignTemplate";
import PrivateRoute from "./components/PrivateRoute";
import CreateUpdateListing from "./pages/CreateUpdateListing";
import Listing from "./pages/Listing";
import Search from "./pages/Search";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="sign-in"
          element={<SignTemplate key={"signin"} isSigninPage={true} />}
        />
        <Route path="sign-up" element={<SignTemplate key={"signup"} />} />
        <Route path="listing/:listingID" element={<Listing />} />
        <Route path="/search" element={<Search />} />
        <Route element={<PrivateRoute />}>
          <Route path="profile" element={<Profile />} />
          <Route
            path="create-listing"
            element={<CreateUpdateListing isUpdate={false} />}
          />
          <Route
            path="update-listing/:listingID"
            element={<CreateUpdateListing isUpdate={true} />}
          />
        </Route>
        <Route path="about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}
