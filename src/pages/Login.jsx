import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  function handleLogin(event) {
    event.preventDefault();

    const savedUsers =
      JSON.parse(
        localStorage.getItem("tripUsers") || "[]"
      );

    const user = savedUsers.find(
      (account) =>
        account.email.toLowerCase() ===
          email.toLowerCase() &&
        account.password === password
    );

    if (!user) {
      alert(
        "Invalid email or password."
      );
      return;
    }

    // Remember who is currently logged in
    localStorage.setItem(
      "currentUser",
      JSON.stringify(user)
    );

    navigate("/dashboard");
  }

  return (
    <div className="auth-page">

      <div className="auth-card">

        <h1>
          TripMitra ✈️
        </h1>

        <p>
          Welcome back!
        </p>


        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            required
          />


          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            required
          />


          <button type="submit">
            Login
          </button>

        </form>


        <p>
          Don't have an account?{" "}

          <button
            type="button"
            onClick={() =>
              navigate("/signup")
            }
          >
            Sign Up
          </button>

        </p>

      </div>

    </div>
  );
}

export default Login;