import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const { user, LogOut } = useContext(AuthContext);
  const role = user?.role;

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
      <ul className="flex space-x-6 items-center">
        <li>
          <Link to="/" className="hover:text-blue-600">Home</Link>
        </li>

        {!user && (
          <>
            <li>
              <Link to="/login" className="hover:text-blue-600">Login</Link>
            </li>
            <li>
              <Link to="/signup" className="hover:text-blue-600">Signup</Link>
            </li>
          </>
        )}

        {user && role === "customer" && (
          <>
            <li>
              <Link to="/customer/dashboard" className="hover:text-blue-600">Dashboard</Link>
            </li>
            <li>
              <Link to="/customer/booking" className="hover:text-blue-600">Book Mamafua</Link>
            </li>
            {/* Removed static review link since it needs parameters */}
            <li>
              <Button
                onClick={LogOut}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Log Out
              </Button>
            </li>
          </>
        )}

        {user && role === "mamafua" && (
          <>
            <li>
              <Link to="/mamafua/dashboard" className="hover:text-blue-600">Dashboard</Link>
            </li>
            <li>
              <Link to="/mamafua/jobs" className="hover:text-blue-600">Jobs</Link>
            </li>
            <li>
              <Link to="/mamafua/reviews" className="hover:text-blue-600">Reviews</Link>
            </li>
            <li>
              <Button
                onClick={LogOut}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Log Out
              </Button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
