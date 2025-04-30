import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProblemsList = () => {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BE_URL}/api/problems/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setProblems(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch problems');
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error m-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Problems</h1>
      <div className="grid gap-6">
        {problems.map((problem) => (
          <div key={problem.id} className="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <div className="card-body">
              <div className="flex justify-between items-start">
                <h2 className="card-title text-2xl">{problem.title}</h2>
                <div className="badge badge-primary">{problem.rating} ★</div>
              </div>
              
              <p className="text-base-content/70">{problem.description}</p>
              
              <div className="mt-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  {problem.tags.map((tag, index) => (
                    <span key={index} className="badge badge-outline">{tag}</span>
                  ))}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {problem.companies.map((company, index) => (
                    <span key={index} className="badge badge-secondary">{company}</span>
                  ))}
                </div>
              </div>

              <div className="card-actions justify-end mt-4">
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate(`/problems/${problem.id}`)}
                >
                  Solve Problem
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProblemsList; 