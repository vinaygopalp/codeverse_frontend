import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Editor from '@monaco-editor/react';

const SubmissionResult = ({ submissionId, onBackToProblem }) => {
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className="min-h-screen bg-base-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Submission Result</h1>
          <button 
            onClick={onBackToProblem}
            className="btn btn-primary"
          >
            Back to Problem
          </button>
        </div>

        {/* Status Card */}
        <div className="card bg-base-200 mb-6">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold mb-2">
                  Status: <span className={submission.status === 'COMPLETED' ? 'text-success' : 'text-error'}>
                    {submission.status}
                  </span>
                </h2>
                <p className="text-lg">
                  Test Cases: {submission.test_cases_passed} / {submission.total_test_cases} passed
                </p>
              </div>
              <div className="stats shadow">
                <div className="stat">
                  <div className="stat-title">Success Rate</div>
                  <div className="stat-value">
                    {Math.round((submission.test_cases_passed / submission.total_test_cases) * 100)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Code Editor */}
        <div className="card bg-base-200 mb-6">
          <div className="card-body">
            <h3 className="text-xl font-semibold mb-4">Your Solution</h3>
            <div className="h-[400px]">
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
        </div>

        {/* Test Cases */}
        <div className="card bg-base-200">
          <div className="card-body">
            <h3 className="text-xl font-semibold mb-4">Test Cases</h3>
            <div className="space-y-4">
              {submission.submission_tests.map((test, index) => (
                <div key={test.id} className="card bg-base-100">
                  <div className="card-body">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Test Case {index + 1}</span>
                      <span className={`badge ${test.status === 'passed' ? 'badge-success' : 'badge-error'}`}>
                        {test.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-base-content/70">Input:</span>
                        <pre className="mt-1 p-2 bg-base-200 rounded">
                          {JSON.stringify(test.input, null, 2)}
                        </pre>
                      </div>
                      <div>
                        <span className="text-sm text-base-content/70">Output:</span>
                        <pre className="mt-1 p-2 bg-base-200 rounded">
                          {JSON.stringify(test.output, null, 2)}
                        </pre>
                      </div>
                    </div>
                    {test.stdout && (
                      <div className="mt-2">
                        <span className="text-sm text-base-content/70">Console Output:</span>
                        <pre className="mt-1 p-2 bg-base-200 rounded text-sm">
                          {test.stdout}
                        </pre>
                      </div>
                    )}
                    {test.error && (
                      <div className="mt-2">
                        <span className="text-sm text-error">Error:</span>
                        <pre className="mt-1 p-2 bg-error/10 rounded text-sm text-error">
                          {test.error}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionResult; 