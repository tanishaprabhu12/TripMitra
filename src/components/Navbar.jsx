import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const currentUser = JSON.parse(
    localStorage.getItem("currentUser") || "null"
  );

  function handleLogout() {
    localStorage.removeItem("currentUser");

    navigate("/login");
  }

  return (
    <nav className="navbar">

      <h2>TripMitra ✈️</h2>

      <div className="navbar-user">

        <span>
          👋
        </span>

        <span>
          {currentUser?.name || "Traveler"}
        </span>

        <button
          type="button"
          onClick={handleLogout}
          className="logout-button"
        >
          Logout
        </button>

      </div>

    </nav>
  );
}

export default Navbar;