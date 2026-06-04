import './styles/App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import './features/admin/assets/admin.css';

// import Header from './components/common/Header/Header';
// import Footer from './components/common/Footer/Footer';
// import Home from './pages/Home/Home';
// import About from './pages/About/About';
// import Login from './features/auth/components/Login';
// import SignUp from './features/auth/components/Sign-Up';
// import Admin_Header from './features/admin/components/AdminHeader';

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
