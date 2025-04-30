import React from "react";
import { Link } from "react-router-dom";
import heroImg from "../assets/react.svg"; // Add a suitable SVG/PNG image here

const Dashboard = () => {
  return (
    <div className="bg-base-100 min-h-screen text-base-content">
      {/* Hero Section */}
      <div className="hero py-12 px-6 lg:px-24 bg-gradient-to-r  from-indigo-600 to-purple-700 text-white">
        <div className="hero-content flex-col lg:flex-row-reverse gap-12">
          <img
            src={heroImg}
            className="max-w-md rounded-lg shadow-2xl"
            alt="CodeVerse Hero"
          />
          <div>
            <h1 className="text-5xl font-bold mb-4">Welcome to CodeVerse 🚀</h1>
            <p className="py-4 text-lg">
              Sharpen your coding skills, solve challenges, and get
              interview-ready with our powerful coding platform.
            </p>
            <Link to="/problems" className="btn btn-accent mt-4">
              Get Started
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <section className="py-16 px-6 lg:px-24">
        <h2 className="text-3xl font-bold text-center mb-12">Why CodeVerse?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body items-center text-center">
              <div className="text-5xl">💻</div>
              <h3 className="card-title">Code in Real Time</h3>
              <p>
                Run code instantly in multiple languages including Python, Java,
                and C in isolated environments.
              </p>
            </div>
          </div>
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body items-center text-center">
              <div className="text-5xl">📊</div>
              <h3 className="card-title">Detailed Progress Tracking</h3>
              <p>
                Track your improvements, daily streaks, and problem-solving
                stats over time with beautiful charts.
              </p>
            </div>
          </div>
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body items-center text-center">
              <div className="text-5xl">🏆</div>
              <h3 className="card-title">Compete & Collaborate</h3>
              <p>
                Join contests, climb leaderboards, and collaborate with peers in
                real-time multiplayer code rooms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <div className="text-center py-12 bg-base-200">
        <h2 className="text-2xl font-semibold mb-4">
          Start solving problems today 🔥
        </h2>
        <p className="mb-6">
          No matter your level, CodeVerse helps you grow fast. Join thousands of
          developers now.
        </p>
        <Link to="/problems" className="btn btn-primary btn-wide">
          Explore Problems
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
