import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminUsername");
    navigate('/');
  };
  return (
    <button
      onClick={handleLogout}
      className="text-gray file:hover:opacity-75 uppercase bg-lime-600 rounded-lg px-3 py-2 font-bold leading-snug"
    >
      Logout
    </button>
  );
};

export { LogoutButton };
