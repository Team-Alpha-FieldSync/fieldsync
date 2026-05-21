import { useNavigate } from "react-router-dom";
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
      onClick={handleLogout} 
    >
      Logout
    </Button>
  );
}