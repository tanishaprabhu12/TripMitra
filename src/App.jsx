import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CreateTrip from "./pages/CreateTrip";
import Explore from "./pages/Explore";
import Groups from "./pages/Groups";
import Expenses from "./pages/Expenses";
import Savings from "./pages/Savings";
import Budget from "./pages/Budget";
import ItineraryBoard from "./pages/ItineraryBoard";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Authentication */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />


        {/* Main pages */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/create-trip"
          element={<CreateTrip />}
        />

        <Route
          path="/expenses"
          element={<Expenses />}
        />

        <Route
          path="/groups"
          element={<Groups />}
        />

        <Route
          path="/savings"
          element={<Savings />}
        />

        <Route
          path="/budget"
          element={<Budget />}
        />

        <Route
          path="/explore"
          element={<Explore />}
        />

        <Route
  path="/itinerary"
  element={<ItineraryBoard />}
/>


        {/* Anything unknown goes to Login */}
        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;