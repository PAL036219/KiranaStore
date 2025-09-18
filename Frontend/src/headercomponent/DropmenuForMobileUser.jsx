import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  useDisclosure,
  User,
  Divider,
  Avatar,
} from "@heroui/react";
import {
  FiUser,
  FiSettings,
  FiShoppingBag,
  FiHeart,
  FiLogOut,
  FiMenu,
  FiX,
  FiCamera,
} from "react-icons/fi";
import { useSelector } from "react-redux";
import React from "react";

import { useDispatch } from "react-redux";
import { logout } from "../reduxstore/userSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const DropmenuFormobileuser = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    onOpenChange(false);
    navigate("/");
  };

  const menuItems = [
    {
      key: "profile",
      label: "My Profile",
      icon: <FiUser className="text-lg " />,
      onClick: () => navigate("/profile"),
    },
    {
      key: "orders",
      label: "My Orders",
      icon: <FiShoppingBag className="text-lg" />,
      onClick: () => navigate("/orders"),
    },
    {
      key: "wishlist",
      label: "Wishlist",
      icon: <FiHeart className="text-lg" />,
      onClick: () => navigate("/wishlist"),
    },
    {
      key: "settings",
      label: "Settings",
      icon: <FiSettings className="text-lg" />,
      onClick: () => navigate("/settings"),
    },
  ];

  return (
    <>
      {/* Mobile Menu Trigger Button with Profile Image */}
      <Button
        onPress={onOpen}
        isIconOnly
        variant="light"
        className="lg:hidden text-gray-700 hover:bg-gray-100 rounded-full p-2 transition-all duration-200"
        aria-label="Open user menu"
      >
        {user.avatar ? (
          <img 
            src={user.avatar} 
            alt="Profile" 
            className="w-8 h-8 rounded-full object-cover border-2 border-white shadow"
            onError={(e) => {
              // Fallback to menu icon if image fails to load
              e.target.style.display = 'none';
            }}
          />
        ) : null}
        
        {/* Show menu icon if no avatar or as fallback */}
        <div className={user.avatar ? 'hidden' : 'block'}>
          {isOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
        </div>
      </Button>

      <Drawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="right"
        className="z-50"
        size="sm"
      >
        <DrawerContent className="bg-white dark:bg-gray-900">
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-2 px-6 pt-6 pb-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    My Account
                  </h2>
                  <Button
                    isIconOnly
                    variant="light"
                    size="sm"
                    onPress={onClose}
                    className="text-gray-500 hover:text-gray-700 dark:hover:text-white"
                  >
                    <FiX className="text-lg" />
                  </Button>
                </div>

                {/* User Profile Section with Enhanced Image Display */}
                {user?._id && (
                  <div className="flex flex-col items-center gap-3 py-4">
                    <div className="relative">
                      {user.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt="Profile" 
                          className="w-20 h-20 rounded-full object-cover border-4 border-blue-500 shadow-lg"
                          onError={(e) => {
                            // Fallback to avatar component if image fails to load
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : null}
                      
                      {/* Fallback avatar if no image or image failed to load */}
                      {!user.avatar && (
                        <div className="w-20 h-20 rounded-full bg-blue-500 border-4 border-blue-500 flex items-center justify-center shadow-lg">
                          <FiUser className="text-white text-3xl" />
                        </div>
                      )}
                      
                      {/* Camera icon for changing profile picture */}
                      <button className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md border border-gray-200 hover:bg-gray-50 transition-colors">
                        <FiCamera className="text-blue-600 text-sm" />
                      </button>
                    </div>
                    
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {user.name || "User"}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {user.email || ""}
                      </p>
                      {user.membership && (
                        <span className="inline-block mt-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                          {user.membership}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </DrawerHeader>

              <DrawerBody className="px-4 py-4">
                <div className="flex flex-col gap-1">
                  {menuItems.map((item) => (
                    <Button
                      key={item.key}
                      variant="light"
                      className="justify-start h-12 px-4 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
                      startContent={item.icon}
                      onPress={() => {
                        item.onClick();
                        onClose();
                      }}
                    >
                      {item.label}
                    </Button>
                  ))}
                </div>

                <Divider className="my-4" />

                {/* Logout Button */}
                <Button
                  variant="light"
                  color="danger"
                  className="justify-start h-12 px-4 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                  startContent={<FiLogOut className="text-lg" />}
                  onPress={handleLogout}
                >
                  Logout
                </Button>
              </DrawerBody>

              <DrawerFooter className="px-6 pb-6 pt-4 border-t border-gray-200 dark:border-gray-800">
                <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                  <p>GOKART v1.0</p>
                  <p className="text-xs mt-1">© 2024 All rights reserved</p>
                </div>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default DropmenuFormobileuser;