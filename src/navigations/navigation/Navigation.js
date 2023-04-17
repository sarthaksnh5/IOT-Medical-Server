import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginScreen from "../../screens/LoginScreen/LoginScreen";
import { Container } from "react-bootstrap";
import DoctorScreen from "../../screens/DoctorScreen/DoctorScreen";
import PatientScreen from "../../screens/PatientScreen/PatientScreen";

function Navigation() {
  return (
    <Router>      
        <Routes>
          <Route path="/" element={<LoginScreen />} />
          <Route path="/doctor" element={<DoctorScreen />} />
          <Route path="/patient" element={<PatientScreen />} />
        </Routes>      
    </Router>
  );
}

export default Navigation;
