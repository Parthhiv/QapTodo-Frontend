import React from "react";

import "../styles/homepage.css";
import "../styles/navbar.css";
import { useAuth } from "../context/AuthContext";

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return (
    <div className="home-container">
      <div className="home-page-body">
        <h1>Welcome to QapTodo</h1>
        <p>Your ultimate task management and productivity tool.</p>

        {!isAuthenticated ? (
          <div className="home-cta">
            <p>Join QapTodo today and stay organized!</p>
            <a href="/login" className="home-button">
              Get Started
            </a>
          </div>
        ) : (
          <div className="home-dashboard-link">
            <p>Jump back into managing your tasks.</p>
            <a href="/dashboard" className="home-button">
              Go to Dashboard
            </a>
          </div>
        )}
      </div>
      <footer className="home-footer">
        <p>&copy; {new Date().getFullYear()} QapTodo. All rights reserved.</p>
        <p>
          <a href="/privacy-policy">Privacy Policy</a> |
          <a href="/terms-of-service"> Terms of Service</a>
        </p>
      </footer>
    </div>
  );
};

export default Home;
