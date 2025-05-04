import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import Editor from '@monaco-editor/react';

const SolveProblem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const contestId = queryParams.get("contest_id");
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [editorTheme, setEditorTheme] = useState('vs-dark');
  const [showAllTestCases, setShowAllTestCases] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ws, setWs] = useState(null);
  const [contestEndTime, setContestEndTime] = useState(null);

  useEffect(() => {
    let timer;
    if (contestId) {
      // Fetch contest details to get end time
      axios
        .get("https://codeverse-latest.onrender.com/message_api/contest_start/")
        .then((response) => {
          const contest = (response.data.contests || []).find(
            (c) => c.contest_id === contestId
          );
          if (contest) {
            setContestEndTime(new Date(contest.end_datetime));
          }
        });
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [contestId]);

  useEffect(() => {
    let timer;
    if (contestEndTime) {
      timer = setInterval(() => {
        if (new Date() > contestEndTime) {
          // Contest ended, redirect to contests page
          navigate("/contests");
        }
      }, 1000); // check every second
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [contestEndTime, navigate]);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        // Fetch problem details
        const problemResponse = await axios.get(
          `${import.meta.env.VITE_BE_URL}/api/problems/${id}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        setProblem(problemResponse.data);

        // Fetch code template
        const codeResponse = await axios.get(
          `${import.meta.env.VITE_BE_URL}/api/problems/${id}/metadata/${language.toLowerCase()}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          }
        );
        setCode(codeResponse.data.evaluator);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch problem details');
        setLoading(false);
      }
    };

    fetchProblem();

    // Cleanup WebSocket connection on component unmount
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [id, language]);

  const handleLanguageChange = async (newLanguage) => {
    setLanguage(newLanguage);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BE_URL}/api/problems/${id}/metadata/${newLanguage.toLowerCase()}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setCode(response.data.evaluator);
    } catch (err) {
      setError('Failed to fetch code template');
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmissionStatus('submitting');
    setSubmissionMessage('Submitting your solution...');

    try {
      const userId = localStorage.getItem('userId'); // Assuming you store userId in localStorage
      const response = await axios.post(
        `${import.meta.env.VITE_BE_URL}/api/submission/`,
        {
          user_id: 1,
          problem_id: parseInt(id),
          language: language.toLowerCase(),
          code: code
        },
        {
          headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
          },
          withCredentials: true
      }
      );

      // Connect to WebSocket
      const wsUrl = response.data.ws_url;
      const newWs = new WebSocket(wsUrl);

      newWs.onopen = () => {
        setSubmissionMessage('Connected to submission server...');
      };

      newWs.onmessage = (event) => {
        console.log(event.data);
        const data = JSON.parse(event.data);
        setSubmissionStatus(data.status.toLowerCase());
        setSubmissionMessage(data.message || `Status: ${data.status}`);

        if (data.status === 'COMPLETED' || data.status === 'FAILED') {
          newWs.close();
          setIsSubmitting(false);
        }
      };

      newWs.onerror = (error) => {
        setSubmissionStatus('error');
        setSubmissionMessage('Error connecting to submission server');
        setIsSubmitting(false);
      };

      // setWs(newWs);
    } catch (err) {
      setSubmissionStatus('error');
      setSubmissionMessage(err.response?.data?.message || 'Submission failed');
      setIsSubmitting(false);
    }
  };

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

  const displayedTestCases = showAllTestCases 
    ? problem.testCases 
    : problem.testCases.slice(0, 3);

  return (
    <div className="flex h-screen bg-base-100">
      {/* Problem Description Section */}
      <div className="w-1/2 overflow-y-auto p-6">
        <div className="mb-6">
          <button 
            onClick={() => navigate('/problems')}
            className="btn btn-ghost btn-sm"
          >
            ← Back to Problems
          </button>
        </div>

        <h1 className="text-3xl font-bold mb-4">{problem.title}</h1>
        
        <div className="flex gap-2 mb-4">
          <div className="badge badge-primary">{problem.rating} ★</div>
          {problem.tags.map((tag, index) => (
            <span key={index} className="badge badge-outline">{tag}</span>
          ))}
        </div>

        <div className="prose max-w-none">
          <p className="text-lg mb-4">{problem.description}</p>

          <h2 className="text-xl font-semibold mt-6 mb-2">Constraints</h2>
          <ul className="list-disc pl-6 mb-6">
            {problem.constraints.map((constraint, index) => (
              <li key={index} className="mb-1">{constraint}</li>
            ))}
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-2">Test Cases</h2>
          <div className="space-y-4 mb-4">
            {displayedTestCases.map((testCase, index) => (
              <div key={testCase.id} className="card bg-base-200">
                <div className="card-body p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">Test Case {index + 1}:</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-base-content/70">Input:</span>
                      <pre className="mt-1 p-2 bg-base-300 rounded">
                        {JSON.stringify(testCase.input, null, 2)}
                      </pre>
                    </div>
                    <div>
                      <span className="text-sm text-base-content/70">Output:</span>
                      <pre className="mt-1 p-2 bg-base-300 rounded">
                        {JSON.stringify(testCase.output.output, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {problem.testCases.length > 3 && (
            <button
              className="btn btn-ghost btn-sm w-full mb-6"
              onClick={() => setShowAllTestCases(!showAllTestCases)}
            >
              {showAllTestCases ? 'Show Less' : `Show More (${problem.testCases.length - 3} more)`}
            </button>
          )}

          <h2 className="text-xl font-semibold mt-6 mb-2">Companies</h2>
          <div className="flex flex-wrap gap-2 mb-6">
            {problem.companies.map((company, index) => (
              <span key={index} className="badge badge-secondary">{company}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Code Editor Section */}
      <div className="w-1/2 bg-base-200 flex flex-col">
        <div className="p-4 border-b border-base-300">
          <div className="flex justify-between items-center">
            <div className="tabs tabs-boxed">
              <button 
                className={`tab ${language === 'python' ? 'tab-active' : ''}`}
                onClick={() => handleLanguageChange('python')}
              >
                Python
              </button>
              <button 
                className={`tab ${language === 'java' ? 'tab-active' : ''}`}
                onClick={() => handleLanguageChange('java')}
              >
                Java
              </button>
              <button 
                className={`tab ${language === 'c' ? 'tab-active' : ''}`}
                onClick={() => handleLanguageChange('c')}
              >
                C
              </button>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-primary btn-sm">Run</button>
              <button 
                className="btn btn-accent btn-sm"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>

        {isSubmitting && (
          <div className="p-4 border-b border-base-300">
            <div className="flex items-center gap-2">
              <span className={`loading loading-spinner loading-sm ${submissionStatus === 'completed' ? 'text-success' : submissionStatus === 'failed' ? 'text-error' : ''}`}></span>
              <span className="text-sm">{submissionMessage}</span>
            </div>
          </div>
        )}

        <div className="flex-1">
          <Editor
            height="100%"
            defaultLanguage={language}
            value={code}
            onChange={(value) => setCode(value)}
            theme={editorTheme}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              readOnly: false,
              automaticLayout: true,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SolveProblem; 