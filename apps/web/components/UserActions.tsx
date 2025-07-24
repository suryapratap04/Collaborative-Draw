"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setSession,
  setUsername,
  setUserId,
  setToken,
} from "@repo/store/userSlice";
import { RootState } from "@repo/store/store";
import Link from "next/link";
import { toast } from "react-toastify";

export default function UserActions() {
  const { session, username } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedSession = localStorage.getItem("session") === "true";
    const storedUserId = localStorage.getItem("userId");
    const storedToken = localStorage.getItem("token");

    if (storedSession) {
      dispatch(setSession(true));
      dispatch(setUsername(storedUsername || ""));
      dispatch(setUserId(storedUserId || ""));
      dispatch(setToken(storedToken || ""));
    }
  }, []);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(setSession(false));
    dispatch(setUsername(""));
    dispatch(setUserId(" "));
    dispatch(setToken(" "));
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    localStorage.removeItem("session");
    toast.success("Logged out successfully");
    // console.log("User logged out successfully");
  };

  if (session) {
    // console.log("session is inside the session comp", session);
    const firstName = username?.split(" ")[0];
    // console.log("firstName is ", username);
    return (
      <>
        <span className="text-base font-medium text-gray-800 dark:text-white">
          👤 {firstName}
        </span>
        <button
          onClick={handleLogout}
          className="bg-red-500 py-2 px-4 rounded-md text-white hover:bg-red-600 mouser-pointer hover:opacity-90 transition-opacity duration-200"
        >
          Logout
        </button>
      </>
    );
  }

  // console.log("session value is  ", session);
  return (
    <>
      <Link
        href="/signin"
        className="inline-block bg-yellow-500 py-2 px-4 border border-transparent rounded-md text-base font-medium text-white hover:bg-opacity-75"
      >
        Sign in
      </Link>
      <Link
        href="/signup"
        className="inline-block bg-white dark:bg-zinc-800 py-2 px-4 border border-transparent rounded-md text-base font-medium text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-zinc-700"
      >
        Sign up
      </Link>
    </>
  );
}
