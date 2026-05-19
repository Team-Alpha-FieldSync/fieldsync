import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return <div>Admin Dashboard
    <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded mt-4">Logout</button>
  </div>;
}