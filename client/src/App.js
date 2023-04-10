import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import User from "./pages/User";
import AddDoc from "./pages/AddDoc";
import DocStatus from "./pages/DocStatus";
import AdminHome from "./pages/AdminHome";
import VerifyDocumen from "./pages/VerifyDocument";
import CheckAuth from "./pages/CheckAuth";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user" element={<User />} />
          <Route path="/add" element={<AddDoc />} />
          <Route path="/status" element={<DocStatus />} />
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/vdocument" element={<VerifyDocumen />} />
          <Route path="/verify" element={<CheckAuth />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
