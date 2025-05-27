import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';

const SubmissionResult = ({ submissionId: propSubmissionId, onBackToProblem }) => {
  const { id: paramSubmissionId } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const submissionId = propSubmissionId || paramSubmissionId;

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BE_URL}/api/submission/${submissionId}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        setSubmission(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch submission details');
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [submissionId]);

  const handleBack = () => {
    if (onBackToProblem) {
      onBackToProblem();
    } else {
      navigate(-1);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="alert alert-error m-4 shadow-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{error}</span>
      </motion.div>
    );
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'accepted':
        return 'bg-green-400 dark:bg-emerald-900/30 border-2 border-green-500 dark:border-emerald-800';
      case 'wrong answer':
        return 'bg-rose-400 dark:bg-red-900/30 border-2 border-rose-500 dark:border-red-800';
      case 'time limit exceeded':
        return 'bg-orange-400 dark:bg-amber-900/30 border-2 border-orange-500 dark:border-amber-800';
      default:
        return 'bg-gray-400 dark:bg-gray-900/30 border-2 border-gray-500 dark:border-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8 mt-16"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <motion.h1
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="text-4xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-400 dark:from-indigo-400 dark:via-purple-400 dark:to-indigo-300 bg-clip-text text-transparent"
        >
          Submission Result
        </motion.h1>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 dark:from-indigo-500 dark:to-purple-500 dark:hover:from-indigo-600 dark:hover:to-purple-600 text-white font-semibold border-none relative overflow-hidden group shadow-lg"
          onClick={handleBack}
        >
          <span className="relative z-10">Back to Problems</span>
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 dark:from-indigo-600 dark:to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card bg-base-200 shadow-xl"
      >
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-2xl font-semibold text-[oklch(0.15_0.01_0)] dark:text-base-content mb-4">
                Problem Details
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-[oklch(0.15_0.01_0)] dark:text-base-content/80">Title</h3>
                  <p className="text-[oklch(0.15_0.01_0)] dark:text-base-content">{submission.problem.title}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[oklch(0.15_0.01_0)] dark:text-base-content/80">Difficulty</h3>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    submission.problem.rating === 1 
                      ? 'bg-green-400 dark:bg-emerald-900/30 border-2 border-green-500 dark:border-emerald-800' 
                      : submission.problem.rating === 2 
                      ? 'bg-orange-400 dark:bg-amber-900/30 border-2 border-orange-500 dark:border-amber-800'
                      : 'bg-rose-400 dark:bg-red-900/30 border-2 border-rose-500 dark:border-red-800'
                  }`}>
                    <span className="text-[oklch(0.15_0.01_0)] dark:text-emerald-300">
                      {submission.problem.rating === 1 ? 'Easy' :
                       submission.problem.rating === 2 ? 'Medium' :
                       'Hard'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-[oklch(0.15_0.01_0)] dark:text-base-content mb-4">
                Submission Details
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-[oklch(0.15_0.01_0)] dark:text-base-content/80">Status</h3>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(submission.status)}`}>
                    <span className="text-[oklch(0.15_0.01_0)] dark:text-emerald-300">{submission.status}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[oklch(0.15_0.01_0)] dark:text-base-content/80">Runtime</h3>
                  <p className="text-[oklch(0.15_0.01_0)] dark:text-base-content">{submission.runtime} ms</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[oklch(0.15_0.01_0)] dark:text-base-content/80">Memory</h3>
                  <p className="text-[oklch(0.15_0.01_0)] dark:text-base-content">{submission.memory} MB</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[oklch(0.15_0.01_0)] dark:text-base-content/80">Language</h3>
                  <p className="text-[oklch(0.15_0.01_0)] dark:text-base-content">{submission.language}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-[oklch(0.15_0.01_0)] dark:text-base-content mb-4">
              Your Code
            </h2>
            <div className="bg-base-300 rounded-lg p-4">
              <Editor
                height="100%"
                defaultLanguage={submission.language}
                value={submission.code}
                theme="vs-dark"
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                }}
              />
            </div>
          </div>

          {submission.error_message && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-[oklch(0.15_0.01_0)] dark:text-base-content mb-4">
                Error Message
              </h2>
              <div className="bg-red-100 dark:bg-red-900/30 rounded-lg p-4 border-2 border-red-200 dark:border-red-800">
                <pre className="text-red-900 dark:text-red-300 whitespace-pre-wrap font-mono text-sm">
                  {submission.error_message}
                </pre>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SubmissionResult; 
