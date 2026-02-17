import "./App.css";
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { useState } from "react";

import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";
import RegisterLoginNavBar from "./components/RegisterLoginNavBar";
import NavBar from "./components/NavBar";
import NavBarUser from "./components/NavBarUser";

import Registration from "./components/Registration";
import AuthLogin from "./components/AuthLogin";
import OtpVerify from "./components/OtpVerify";
import SecurityQuestions from "./components/SecurityQuestions";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

import UserHome from "./components/UserHome";
import AdminHome from "./components/AdminHome";
import Footer from "./components/Footer";
import EcoHome from "./components/EcoHome";

import ProductListing from "./components/ProductListing";
import ProductDetail from "./components/ProductDetail";


import UpdateUserDetails from "./components/UpdateUserDetails";

import PaymentGateway from "./components/PaymentGateway";
import PaymentSuccess from "./components/PaymentSuccess";
import Cart from "./components/Cart";
import UserOrders from "./components/UsersOrders";

import CarbonImpactForm from "./components/CarbonImpactForm";
import MyImpactDashboard from "./components/MyImpactDashboard";

import SustainabilityNews from "./components/SustainabilityNews";
import EcoScorePage from "./components/EcoScorePage";

function MainContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleEcoScoreClick = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    navigate("/ecoscore");
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/eco-home"
        element={
          <>
            <NavBar
              AboutAccount="Sign Up/Sign In"
              onSearch={setSearchTerm}
              onEcoScoreClick={handleEcoScoreClick}
            />
            <ProductListing searchTerm={searchTerm} />
            <Footer />
          </>
        }
      />
      <Route
        path="/"
        element={
          <>
            <EcoHome />
            <Footer />
          </>
        }
      />
      <Route path="/sus-news" element={<SustainabilityNews />} />
      <Route path="/otp" element={<OtpVerify />} />
      <Route path="/security-questions" element={<SecurityQuestions />} />
      <Route path="/login" element={
        <>
        <RegisterLoginNavBar Button="Back" />
        <AuthLogin />
        {/* <Footer /> */}
        </>
      } />
      <Route path="/home" element={<h1>Welcome Home</h1>} />
      <Route path="/products/:id" element={
        <>
        {/* <RegisterLoginNavBar Button="Home" /> */}
        <ProductDetail />
        </>
      } />
      <Route
        path="/aboutUs"
        element={
          <>
            <RegisterLoginNavBar Button="Home" />
            <AboutUs />
            <Footer />
          </>
        }
      />
      <Route path="/cart" element={
        <>
        <Cart />
        <Footer />
        </>
      } />
      <Route
        path="/contactUs"
        element={
          <>
            <RegisterLoginNavBar Button="Home" />
            <ContactUs />
            <Footer />
          </>
        }
      />
      <Route path="/payment-gateway" element={
        <>
        <PaymentGateway />
        <Footer />
        </>
      } />
      <Route path="/payment-success" element={
        <>
        <PaymentSuccess />
        <Footer />
        </>
      } />
      <Route
        path="/registration"
        element={
          <>
            <RegisterLoginNavBar Button="Home" />
            <Registration />
          </>
        }
      />
      {/* User Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/home-user" element={
          <>
          <UserHome />
          <Footer />
          </>
        } />
        <Route path="/user-orders" element={
          <>
          <UserOrders />
          <Footer />
          </>
        } />
        <Route
          path="/calculate-ecoscore"
          element={
            <>
              <RegisterLoginNavBar Button="Home" />
              <EcoScorePage />
              <Footer />
            </>
          }
        />
        <Route
          path="/carbon-impact"
          element={
            <>
              <NavBarUser />
              <CarbonImpactForm />
              <Footer />
            </>
          }
        />
        <Route
          path="/my-impact"
          element={
            <>
              <NavBarUser />
              <MyImpactDashboard />
              <Footer />
            </>
          }
        />
        <Route
          path="/update-user-details"
          element={
            <>
              <NavBarUser />
              <UpdateUserDetails />
              <Footer />
            </>
          }
        />
      </Route>
      {/* Admin Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin/add-products" element={<AdminHome />} />
        </Route>
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <MainContent />
    </Router>
  );
}

export default App;