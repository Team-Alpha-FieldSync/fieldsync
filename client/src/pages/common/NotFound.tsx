import { Link, useNavigate } from "react-router-dom";
import { FileQuestion } from "lucide-react";
import Button from "../../components/ui/Button";
import useAuth from "../../hooks/useAuth";

function getHomePath(role: string | undefined): string {
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "TECHNICIAN":
      return "/technician";
    default:
      return "/login";
  }
}

export default function NotFound() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const homePath = getHomePath(user?.role);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-bg">
      <div className="w-full max-w-md text-center bg-bg-light rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 sm:p-10">
        <p className="text-6xl font-bold text-primary mb-2" aria-hidden>
          404
        </p>

        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <FileQuestion className="h-7 w-7" aria-hidden />
        </div>

        <h1 className="text-2xl font-bold text-fg mb-2">Page not found</h1>
        <p className="text-sm text-fg-muted mb-6">
          The page you’re looking for doesn’t exist or may have been moved.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button variant="primary" onClick={() => navigate(homePath, { replace: true })}>
            {isAuthenticated ? "Go to dashboard" : "Go to login"}
          </Button>
          <Button
            variant="ghost"
            type="button"
            onClick={() => navigate(-1)}
          >
            Go back
          </Button>
        </div>

        {isAuthenticated && (
          <Link
            to={homePath}
            className="mt-4 inline-block text-sm text-primary hover:text-primary/80 transition-colors"
          >
          </Link>
        )}
      </div>
    </div>
  );
}