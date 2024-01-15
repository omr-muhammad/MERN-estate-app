import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Header from "./components/Header";
import SignTemplate from "./pages/SignTemplate";

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
        <Route path="profile" element={<Profile />} />
        <Route path="about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}
