import './assets/styles/App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './pages/admin/shared/layout/AdminLayout';
import './assets/styles/admin.css';

// import Header from './components/Header';
// import Footer from './components/Footer';
// import Home from './pages/user/home/Home';
// import About from './pages/user/about/About';
// import Login from './pages/user/auth/Login';
// import SignUp from './pages/user/auth/Sign-Up';
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
