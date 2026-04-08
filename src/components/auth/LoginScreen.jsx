import { useState } from 'react';
import { useUser } from '../../hooks/useUser';

const BRANCHES = ['MCA', 'CSE', 'IT', 'ECE', 'EEE', 'BCA', 'MBA', 'BBA', 'Mechanical', 'Civil', 'Other'];

export default function LoginScreen() {
  const { login } = useUser();
  const [name, setName] = useState('');
  const [branch, setBranch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !branch) {
      setError('Please enter your name and select a branch.');
      return;
    }
    setError('');
    setLoading(true);
    // login() is now localStorage-first and never throws
    await login(name.trim(), branch);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-600/20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-accent-500/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-[80px]" />
      </div>

      {/* Animated grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <div className="relative w-full max-w-md animate-slide-up">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 shadow-2xl shadow-brand-600/40 mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">WebChat</h1>
          <p className="text-surface-200 mt-2 text-sm">Real-time messaging for your campus</p>
        </div>

        {/* Card */}
        <div className="bg-surface-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-6">Join the Conversation</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-surface-100 mb-2">
                Your Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                autoComplete="off"
                className="
                  w-full px-4 py-3 rounded-xl bg-surface-800/80 border border-white/10
                  text-white placeholder-surface-200/40 text-sm
                  focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/40
                  transition-all duration-200
                "
              />
            </div>

            {/* Branch */}
            <div>
              <label htmlFor="branch" className="block text-sm font-medium text-surface-100 mb-2">
                Branch / Department
              </label>
              <select
                id="branch"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="
                  w-full px-4 py-3 rounded-xl bg-surface-800/80 border border-white/10
                  text-white text-sm appearance-none cursor-pointer
                  focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/40
                  transition-all duration-200
                "
              >
                <option value="" disabled className="bg-surface-800">Select your branch</option>
                {BRANCHES.map((b) => (
                  <option key={b} value={b} className="bg-surface-800">{b}</option>
                ))}
              </select>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 text-danger-400 text-sm bg-danger-500/10 border border-danger-500/20 rounded-xl px-4 py-3 animate-fade-in">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full py-3 px-6 rounded-xl font-semibold text-white
                bg-gradient-to-r from-brand-400 to-brand-600
                hover:from-brand-300 hover:to-brand-500
                focus:outline-none focus:ring-2 focus:ring-brand-500/50
                disabled:opacity-60 disabled:cursor-not-allowed
                transition-all duration-200 hover:shadow-lg hover:shadow-brand-600/30
                active:scale-[0.98]
                flex items-center justify-center gap-2 text-sm
              "
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Connecting…
                </>
              ) : (
                <>
                  Start Chatting
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <p className="text-center text-surface-200/50 text-xs mt-6">
            No account needed · Your session is saved locally
          </p>
        </div>
      </div>
    </div>
  );
}
