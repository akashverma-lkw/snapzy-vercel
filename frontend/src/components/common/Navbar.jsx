import { useNavigate } from "react-router-dom";
import { FaInfinity } from "react-icons/fa6";
import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import { FaGamepad } from "react-icons/fa";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";

import AiAskModal from "../../pages/AI Ask/AiAsk";
import TicTacToe from './TicTacToe';

const Navbar = () => {
  const [showModal, setShowModal] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const [menuOpen, setMenuOpen] = useState(false);

  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/auth/logout`, { method: "POST" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      navigate("/");
    },
    onError: () => {
      toast.error("Logout failed");
    },
  });

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="fixed top-0 left-0 w-full bg-black border-b border-gray-700 p-2 flex items-center justify-between z-50 px-4 md:px-16"
    >
      {/* Logo Section */}
      <Link to="/homepage" className="flex items-center text-white text-2xl font-bold">
        Snapzy
      </Link>

      {/* Desktop Menu */}
      <ul className="hidden md:flex gap-6">
        <li>
          <Link
            to="/homepage"
            className="flex items-center gap-2 hover:bg-stone-900 transition-all rounded-full duration-300 py-2 px-4"
          >
            <MdHomeFilled className="w-6 h-6" />
            <span className="text-lg hidden md:inline">Home</span>
          </Link>
        </li>
        <li>
          <Link
            to="/notifications"
            className="flex items-center gap-2 hover:bg-stone-900 transition-all rounded-full duration-300 py-2 px-4"
          >
            <IoNotifications className="w-6 h-6" />
            <span className="text-lg hidden md:inline">Notifications</span>
          </Link>
        </li>
        <li>
          <Link
            to={`/profile/${authUser?.username}`}
            className="flex items-center gap-2 hover:bg-stone-900 transition-all rounded-full duration-300 py-2 px-4"
          >
            <FaUser className="w-6 h-6" />
            <span className="text-lg hidden md:inline">Profile</span>
          </Link>
        </li>

        {/* AI Ask link */}
        <li>
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="flex items-center gap-2 hover:bg-stone-900 transition-all rounded-full duration-300 py-2 px-4 text-white"
          >
            <FaInfinity className="w-6 h-6" />
            <span className="text-lg hidden md:inline">Ai Ask</span>
          </button>
          <AiAskModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} />
        </li>

      </ul>

      <button
        onClick={() => setIsAiModalOpen(true)}
        className="md:hidden flex items-center gap-2 hover:bg-stone-900 transition-all rounded-full duration-300 py-2 px-4 text-white"
      >
        <FaInfinity className="w-6 h-6" />
        <span className="text-lg">Ai Ask</span>
      </button>
      <AiAskModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} />

      {/* Mobile Menu Icon */}
      <button className="md:hidden text-white text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
        <RxHamburgerMenu />
      </button>

      {/* Mobile Menu (Toggle) */}
      {menuOpen && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute top-12 left-0 w-full min-h-screen pt-44 bg-black border-t border-gray-700 flex flex-col items-center py-4 gap-4 md:hidden"
        >
          <Link to="/homepage" className="flex items-center gap-2 text-white py-2" onClick={() => setMenuOpen(false)}>
            <MdHomeFilled className="w-6 h-6" />
            <span>Home</span>
          </Link>
          <Link to="/notifications" className="flex items-center gap-2 text-white py-2" onClick={() => setMenuOpen(false)}>
            <IoNotifications className="w-6 h-6" />
            <span>Notifications</span>
          </Link>
          <Link to={`/profile/${authUser?.username}`} className="flex items-center gap-2 text-white py-2" onClick={() => setMenuOpen(false)}>
            <FaUser className="w-6 h-6" />
            <span>Profile</span>
          </Link>

          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 text-white py-2">
          <FaGamepad className="w-6 h-6" />
            Play Game
          </button>
          <TicTacToe isOpen={showModal} onClose={() => setShowModal(false)} />

          <div
            className="flex gap-1 cursor-pointer text-white hover:text-red-500 mt-4"
            onClick={(e) => {
              e.preventDefault();
              logout();
              setMenuOpen(false);
            }}
          >
            <IoIosLogOut className="w-6 h-6" /> Logout
          </div>
        </motion.div>
      )}

      {/* Profile & Logout (Desktop) */}
      {authUser && (
        <div className="hidden md:flex items-center gap-3">
          <Link to={`/profile/${authUser.username}`} className="flex items-center gap-2">
            <div className="w-8 rounded-full">
              <img src={authUser?.profileImg || "/avatar-placeholder.png"} className="rounded-full" />
            </div>
            <div className="text-white">
              <p className="font-bold text-sm w-20 truncate">{authUser?.fullName}</p>
              <p className="text-slate-500 text-sm">@{authUser?.username}</p>
            </div>
          </Link>
          <div
            className="flex gap-1 cursor-pointer hover:text-red-500 ml-8"
            onClick={(e) => {
              e.preventDefault();
              logout();
            }}
          >
            <IoIosLogOut className="w-6 h-6" /> Logout
          </div>
        </div>
      )}
    </motion.nav>
  );
};

export default Navbar;
