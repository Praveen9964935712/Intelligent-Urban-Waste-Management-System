import { useNavigate } from "react-router-dom";

function StaffDashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    navigate("/login");
  };

  return (
    <main>
      <h1>Staff workspace</h1>
      <p>Welcome, {localStorage.getItem("name") || "staff member"}.</p>
      <p>Your account is active. Assigned task tools can be connected here.</p>
      <button type="button" onClick={logout}>Sign out</button>
    </main>
  );
}

export default StaffDashboard;
