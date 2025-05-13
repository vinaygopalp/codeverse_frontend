import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const SubmissionsList = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { problemId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const userId = localStorage.getItem('userId');
        let url = `${import.meta.env.VITE_BE_URL}/api/submission/?user_id=${userId}`;
        
        // Add problem_id to URL if viewing problem-specific submissions
        if (problemId) {
          url += `&problem_id=${problemId}`;
        }

        const response = await axios.get(url, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setSubmissions(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch submissions');
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [problemId]);

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
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{error}</span>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'badge-success';
      case 'FAILED':
        return 'badge-error';
      case 'EXECUTING':
        return 'badge-warning';
      default:
        return 'badge-ghost';
    }
  };

  return (
    <div className="min-h-screen bg-base-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            {problemId ? 'Problem Submissions' : 'All Submissions'}
          </h1>
          {problemId && (
            <button 
              onClick={() => navigate(`/problems/${problemId}`)}
              className="btn btn-primary"
            >
              Back to Problem
            </button>
          )}
        </div>

        {/* Submissions Table */}
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Problem ID</th>
                <th>Language</th>
                <th>Status</th>
                <th>Test Cases</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr key={submission.id} className="hover">
                  <td className="font-mono text-sm">{submission.id.slice(0, 8)}...</td>
                  <td>{submission.problem_id}</td>
                  <td>
                    <span className="badge badge-ghost">
                      {submission.language}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${getStatusColor(submission.status)}`}>
                      {submission.status}
                    </span>
                  </td>
                  <td>
                    {submission.status === 'COMPLETED' || submission.status === 'FAILED' ? (
                      `${submission.test_cases_passed}/${submission.total_test_cases}`
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => navigate(`/submissions/${submission.id}`)}
                      className="btn btn-ghost btn-sm"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {submissions.length === 0 && (
          <div className="text-center py-8">
            <p className="text-lg text-base-content/70">No submissions found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionsList; 