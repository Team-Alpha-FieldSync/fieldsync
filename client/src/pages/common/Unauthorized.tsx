import { Link, useNavigate } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import Button from "../../components/ui/Button";
import useAuth from "../../hooks/useAuth";

export default function Unauthorized() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-bg">
      <div className="w-full max-w-md text-center bg-bg-light rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 sm:p-10">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-danger/10 text-danger">
          <ShieldAlert className="h-7 w-7" aria-hidden />
        </div>

        <h1 className="text-2xl font-bold text-fg mb-2">Access denied</h1>
        <p className="text-sm text-fg-muted mb-6">
          {user
            ? `Signed in as ${user.email}, but this area isn’t available for your role.`
            : "You don’t have permission to view this page."}
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button variant="primary" onClick={handleLogout}>
            Sign in with another account
          </Button>
          <Link to="/login">
            <Button variant="ghost" className="w-full sm:w-auto">
              Back to login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}