import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

type Props = {
  className?: string;
};

export default function LogoutButton({
  className = "bg-red-500 text-white px-4 py-2 rounded mt-4",
}: Props) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <button type="button" onClick={handleLogout} className={className}>
      Logout
    </button>
  );
}