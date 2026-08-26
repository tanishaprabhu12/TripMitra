import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  function handleSignup(event) {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const savedUsers =
      JSON.parse(
        localStorage.getItem("tripUsers") || "[]"
      );

    const existingUser = savedUsers.find(
      (user) =>
        user.email.toLowerCase() ===
        email.toLowerCase()
    );

    if (existingUser) {
      alert(
        "An account with this email already exists."
      );
      return;
    }

    const newUser = {
      id: Date.now(),
      name,
      email: email.toLowerCase(),
      password,
    };

    const updatedUsers = [
      ...savedUsers,
      newUser,
    ];

    localStorage.setItem(
      "tripUsers",
      JSON.stringify(updatedUsers)
    );

    alert(
      "Account created successfully! Please log in."
    );

    navigate("/login");
  }

  return (
    <div className="auth-page">

      <div className="auth-card">

        <h1>
          Join TripMitra ✈️
        </h1>

        <p>
          Create your account
        </p>


        <form onSubmit={handleSignup}>

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            required
          />


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
            minLength="6"
          />


          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(
                event.target.value
              )
            }
            required
            minLength="6"
          />


          <button type="submit">
            Create Account
          </button>

        </form>


        <p>
          Already have an account?{" "}

          <button
            type="button"
            onClick={() =>
              navigate("/login")
            }
          >
            Login
          </button>

        </p>

      </div>

    </div>
  );
}

export default Signup;