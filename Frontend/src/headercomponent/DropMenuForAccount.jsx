import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import { FaChevronDown } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SummaryAPI from "../common/SummaryAPI";
import { logout } from "../reduxstore/userSlice";
import Axios from "../utils/Axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Dropdownarrow = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleonclickevent = async () => {
    navigate("/profile");
  };

  const handleLogout = async () => {
    try {
      const response = await Axios({
        ...SummaryAPI.logouttheuser,
      });
      if (response.data.success) {
        dispatch(logout());
        localStorage.clear();
        toast.success("Logout Successful 🥺!");
        navigate("/"); // Redirect to home after logout
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Unable to Logout!");
    }
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant="solid"
          className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3.5 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
          endContent={<FaChevronDown className="text-sm ml-1" />}
        >
          Account
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="User actions menu"
        className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 min-w-[200px]"
      >
        <DropdownItem
          key="profile"
          textValue={user.name || "User name"}
          className="px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-150"
        >
          <div onClick={handleonclickevent} className="cursor-pointer">
            {user.name || "User"}
          </div>
        </DropdownItem>
        
        <DropdownItem
          key="email"
          textValue={user.email || "User email"}
          className="px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-150"
        >
          <div onClick={handleonclickevent} className="cursor-pointer">
            {user.email || "user@example.com"}
          </div>
        </DropdownItem>

        <DropdownItem
          key="orders"
          textValue="My Orders"
          className="px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-150"
        >
          <Link to="/profile" className="w-full block">
            My Orders
          </Link>
        </DropdownItem>

        <DropdownItem
          key="logout"
          textValue="Logout"
          className="px-3 py-2 rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-150"
        >
          <div onClick={handleLogout} className="cursor-pointer w-full">
            Logout
          </div>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default Dropdownarrow;