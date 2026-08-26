import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar">

      <Link
        to="/dashboard"
        className={
          location.pathname === "/dashboard"
            ? "sidebar-active"
            : ""
        }
      >
        🏠 Dashboard
      </Link>


      <Link
        to="/expenses"
        className={
          location.pathname === "/expenses"
            ? "sidebar-active"
            : ""
        }
      >
        💸 Expenses
      </Link>


      <Link
        to="/groups"
        className={
          location.pathname === "/groups"
            ? "sidebar-active"
            : ""
        }
      >
        👥 Groups
      </Link>


      <Link
        to="/savings"
        className={
          location.pathname === "/savings"
            ? "sidebar-active"
            : ""
        }
      >
        🎯 Savings
      </Link>


      <Link
        to="/budget"
        className={
          location.pathname === "/budget"
            ? "sidebar-active"
            : ""
        }
      >
        📊 Trip Budget
      </Link>


      <Link
        to="/itinerary"
        className={
          location.pathname === "/itinerary"
            ? "sidebar-active"
            : ""
        }
      >
        🗓️ Itinerary
      </Link>


      <Link
        to="/explore"
        className={
          location.pathname === "/explore"
            ? "sidebar-active"
            : ""
        }
      >
        🌍 Explore
      </Link>

    </aside>
  );
}

export default Sidebar;