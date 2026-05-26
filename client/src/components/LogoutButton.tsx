import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import useAuth from "../hooks/useAuth";
import Button from "./ui/Button";

export default function LogoutButton() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Button
      type="button"
      variant="danger"
      className="w-full flex items-center justify-center gap-2"
      onClick={handleLogout}
    >
      <LogOut size={16} />
      Logout
    </Button>
  );
}
