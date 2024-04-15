// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { UserProvider } from "./UserContext";
import Login from "./Pages/Login";
import ResetPassword from "./Pages/ResetPassword";
import Profile from "./Pages/Profile";

import PerformancePage from "./Pages/PerformancePage";
import SchedulePage from "./Pages/Schedule"; // Import the Calendar component
import EmpCalendar from "./Pages/CalendarEmp";
import IntCalendar from "./Pages/CalendarInt";
import SendEmail from "./Pages/SendEmail";
import TrackTraining from "./Pages/TrackTraining";
import LandingPage from "./Pages/LandingPage";

// Import the Calendar component
// Import the Calendar component

function App() {
  return (
    <Router>
      <UserProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/trackTraining" element={<TrackTraining />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/performance" element={<PerformancePage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/intern-schedule" element={<IntCalendar />} />
          <Route path="/employee-schedule" element={<EmpCalendar />} />
          <Route path="/sendEmail" element={<SendEmail />} />
          <Route render={() => <h1>Page not found</h1>} />
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;
