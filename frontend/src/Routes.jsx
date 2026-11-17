import React, { useEffect } from "react";
import { useNavigate, useRoutes } from "react-router-dom";

//Page list
import Home from "./components/home/Home";
import Dashboard from "./components/dashboard/Dashboard";
import Profile from "./components/user/Profile";
import Settings from "./components/user/Settings";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import CreateRepo from "./components/repo/CreateRepo";
import RepoDetail from "./components/repo/RepoDetail";
import CreateIssue from "./components/issue/CreateIssue";
import IssueDetail from "./components/issue/IssueDetail";

//Auth Context
import { useAuth } from "./authContext";

const ProjectRoutes = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem("userId");

    if (userIdFromStorage && !currentUser) {
      setCurrentUser(userIdFromStorage);
    }

    if (userIdFromStorage && window.location.pathname === "/auth") {
      navigate("/dashboard");
    }
  }, [currentUser, navigate, setCurrentUser]);

  let element = useRoutes([
    {
      path: "/",
      element: currentUser ? <Dashboard /> : <Home />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
    },
    {
      path: "/auth",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/profile",
      element: <Profile />,
    },
    {
      path: "/settings",
      element: <Settings />,
    },
    {
      path: "/create",
      element: <CreateRepo />,
    },
    {
      path: "/repo/:id",
      element: <RepoDetail />,
    },
    {
      path: "/repo/:id/issues/new",
      element: <CreateIssue />,
    },
    {
      path: "/issue/:id",
      element: <IssueDetail />,
    },
  ]);

  return element;
};

export default ProjectRoutes;
