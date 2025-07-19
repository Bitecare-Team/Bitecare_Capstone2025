
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-healthcare-background">
      <div className="text-center p-8">
        <h1 className="text-6xl font-bold text-healthcare-primary mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Oops! We couldn't find that page.</p>
        <p className="max-w-md mx-auto text-muted-foreground mb-8">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <Button asChild>
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
