import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Trash2, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageTransition } from '../components/ui/PageTransition';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { SessionFooter } from '../components/ui/SessionFooter';

interface LoginFormState {
  email: string;
  password: string;
}

export function LoginScreen() {
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginFormState>({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // MVP: accept any input — no real auth
    navigate('/onboarding');
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    // Simulate 1-second SSO loading for demo realism
    setTimeout(() => {
      navigate('/onboarding');
    }, 1000);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-navy flex flex-col">
        {/* Header */}
        <header className="px-6 pt-8 pb-4">
          <div className="max-w-5xl mx-auto flex items-center gap-2">
            <div className="w-8 h-8 bg-teal rounded-lg flex items-center justify-center">
              <span className="text-navy font-bold text-sm">GL</span>
            </div>
            <span className="text-gray-light font-semibold text-lg tracking-tight">
              GradeLens
            </span>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

            {/* Left: Login form */}
            <div className="w-full max-w-md mx-auto lg:mx-0">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-3xl font-bold text-gray-light tracking-tight mb-2">
                  Know your grade
                  <br />
                  <span className="text-teal">before you submit.</span>
                </h1>
                <p className="text-gray-mid text-sm mb-8">
                  Upload your rubric and draft — GradeLens maps your work to the marking criteria in seconds.
                </p>

                {/* Google SSO */}
                <Button
                  variant="secondary"
                  size="lg"
                  fullWidth
                  loading={googleLoading}
                  onClick={handleGoogleLogin}
                  className="mb-4"
                  aria-label="Continue with Google"
                >
                  {!googleLoading && (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  )}
                  {googleLoading ? 'Signing in…' : 'Continue with Google'}
                </Button>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-xs text-gray-dark">or sign in with email</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                {/* Email/password form */}
                <form onSubmit={handleEmailLogin} className="space-y-4" noValidate>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-mid mb-1.5"
                    >
                      Email address
                    </label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder="you@university.edu.au"
                      className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-light placeholder-gray-dark focus-visible:outline-2 focus-visible:outline-teal transition-colors duration-200"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-mid mb-1.5"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        value={form.password}
                        onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                        placeholder="••••••••"
                        className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 pr-11 text-sm text-gray-light placeholder-gray-dark focus-visible:outline-2 focus-visible:outline-teal transition-colors duration-200"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-mid hover:text-gray-light transition-colors duration-200 p-1 rounded focus-visible:outline-2 focus-visible:outline-teal"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" variant="primary" size="lg" fullWidth>
                    Get started
                  </Button>
                </form>

                <p className="text-xs text-gray-dark text-center mt-4">
                  No account needed — any email works for this demo.
                </p>
              </motion.div>
            </div>

            {/* Right: Privacy at a glance */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="w-full max-w-md mx-auto lg:mx-0"
            >
              <Card accent padding="lg">
                <h2 className="text-base font-semibold text-gray-light tracking-tight mb-1">
                  Privacy at a glance
                </h2>
                <p className="text-xs text-gray-mid mb-6">
                  GradeLens is designed with your academic integrity in mind.
                </p>

                <ul className="space-y-5" aria-label="Privacy commitments">
                  <li className="flex items-start gap-4">
                    <div className="p-2 bg-teal/10 rounded-xl shrink-0 mt-0.5">
                      <Trash2 size={18} className="text-teal" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-light">
                        We don't store your draft after this session
                      </p>
                      <p className="text-xs text-gray-mid mt-0.5">
                        Your work lives only in your browser tab. Close it and it's gone.
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start gap-4">
                    <div className="p-2 bg-teal/10 rounded-xl shrink-0 mt-0.5">
                      <Shield size={18} className="text-teal" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-light">
                        We never train AI on your work
                      </p>
                      <p className="text-xs text-gray-mid mt-0.5">
                        Your assignment is never used to improve any model — ever.
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start gap-4">
                    <div className="p-2 bg-teal/10 rounded-xl shrink-0 mt-0.5">
                      <Lock size={18} className="text-teal" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-light">
                        You can delete everything in one click
                      </p>
                      <p className="text-xs text-gray-mid mt-0.5">
                        The "Delete this session" button on your report clears all data instantly.
                      </p>
                    </div>
                  </li>
                </ul>

                <div className="mt-6 pt-5 border-t border-white/8">
                  <p className="text-xs text-gray-dark leading-relaxed">
                    GradeLens is a study support tool. Using it to understand your rubric is no different from visiting your lecturer's office hours. Always check your university's AI use policy.
                  </p>
                </div>
              </Card>
            </motion.div>

          </div>
        </main>

        <SessionFooter />
      </div>
    </PageTransition>
  );
}
