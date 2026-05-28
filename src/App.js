import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicLayout from './Component/PublicLayout';
import AdminLayout from './Admin/Layout/AdminLayout';
import './admin.css';

// import Header from './Component/Header';
// import Footer from './Component/Footer';
// import Home from './Component/Home';
// import About from './Component/About';
// import Login from './Component/Login';
// import SignUp from './Component/Sign-Up';
// import Admin_Header from './Admin/Header';

// import "bootstrap-icons/font/bootstrap-icons.css";

function App() {
  return (
    <>


      <BrowserRouter>
        {/* <Header /> */}

        <Routes>
          {/* <Route path="/" element={<Home />} />
          <Route path="/About-Us" element={<About />} />

          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} /> */}


          {/* Public Website */}
          <Route path="/*" element={<PublicLayout />} />

          {/* Admin Panel */}
          <Route path="/admin/*" element={<AdminLayout />} />

          {/* Admin Panel
          <Route path="/admin" element={<Admin_Header/>} /> */}

        </Routes>

        {/* <Footer /> */}

      </BrowserRouter>
    </>
  );
}

export default App;
