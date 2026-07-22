import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '../components/ui';
import { useToast } from '../hooks';

export default function Login() {
  const navigate = useNavigate();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mockupIndex, setMockupIndex] = useState(0);

  const carouselItems = [
    {
      image: '/img/mockup/mockup_login.png',
      text: 'The smarter way to manage your sales pipeline'
    },
    {
      image: '/img/mockup/mockup_login2.png',
      text: 'Track your deals and forecast revenue accurately'
    },
    {
      image: '/img/mockup/mockup_login3.png',
      text: 'Boost your team\'s productivity and close more deals'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMockupIndex((prev) => (prev + 1) % carouselItems.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [carouselItems.length]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (email && password) {
        localStorage.setItem('auth_token', 'mock_token');
        toast.success('Login successful');
        navigate('/dashboard');
      } else {
        toast.error('Please enter email and password');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="h-[100dvh] overflow-hidden bg-[#ececef] p-3 text-stone-900 sm:p-5 lg:p-8">
      <div className="mx-auto grid h-full w-full max-w-[1480px] overflow-hidden rounded-[2rem] bg-white p-3 shadow-2xl shadow-stone-400/20 lg:grid-cols-[1.02fr_0.98fr]">
        <main className="flex min-h-0 flex-col rounded-[1.5rem] bg-white px-5 py-6 sm:px-8 lg:px-12 xl:px-16">
          <div className="flex items-center justify-between gap-4">
            <img
              src="/img/Logo.png"
              alt="Orbis CRM"
              className="h-8 w-auto mix-blend-multiply"
            />
            <p className="hidden text-xs font-semibold text-stone-500 sm:block">
              Need access? <span className="text-blue-600">Contact admin</span>
            </p>
          </div>

          <div className="flex flex-1 items-center justify-center py-6">
            <div className="w-full max-w-[520px]">
              <div className="space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-blue-600">CRM Workspace</p>
                <h1 className="text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">Get started now</h1>
                <p className="text-sm leading-6 text-stone-500">
                  Enter your account details to access your CRM dashboard.
                </p>
              </div>

              <div className="mt-9 grid grid-cols-2 gap-4">
                <button type="button" className="flex h-12 items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-4 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-50 active:bg-stone-100">
                  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Log in with Google
                </button>
                <button type="button" className="flex h-12 items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-4 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-50 active:bg-stone-100">
                  <svg viewBox="0 0 384 512" height="18" fill="currentColor" className="text-[#333]" xmlns="http://www.w3.org/2000/svg">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                  </svg>
                  Log in with Apple
                </button>
              </div>

              <div className="relative my-7 flex items-center">
                <div className="flex-grow border-t border-stone-200"></div>
                <span className="mx-4 flex-shrink-0 text-sm font-medium text-stone-400">or</span>
                <div className="flex-grow border-t border-stone-200"></div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  size="md"
                  className="h-12 rounded-xl border-stone-200 bg-white text-stone-900 shadow-none placeholder:text-stone-400 focus:bg-white"
                />

                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  size="md"
                  className="h-12 rounded-xl border-stone-200 bg-white text-stone-900 shadow-none placeholder:text-stone-400 focus:bg-white"
                />

                <div className="flex items-center justify-end text-xs font-semibold">
                  <button type="button" className="text-blue-600 transition-colors hover:text-blue-700">
                    Forgot password?
                  </button>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="h-12 w-full rounded-xl bg-blue-600 text-sm font-bold text-white shadow-xs hover:bg-blue-700 active:translate-y-px"
                  loading={loading}
                >
                  Login
                </Button>
              </form>
            </div>
          </div>

          <p className="text-center text-xs font-medium text-stone-400">© 2026. All rights reserved.</p>
        </main>

        <aside className="relative hidden min-h-0 overflow-hidden rounded-[1.5rem] bg-blue-600 lg:block" aria-hidden="true">
          <div className="absolute inset-x-10 top-12 z-10 text-center">
            <div className="relative h-28 xl:h-36">
              {carouselItems.map((item, i) => (
                <h2
                  key={i}
                  className={`absolute inset-0 flex items-center justify-center text-3xl font-semibold leading-snug tracking-tight text-white xl:text-4xl transition-all duration-[1000ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${
                    i === mockupIndex
                      ? 'opacity-100 translate-y-0 scale-100 z-10'
                      : i < mockupIndex
                        ? 'opacity-0 -translate-y-8 scale-95 z-0 pointer-events-none'
                        : 'opacity-0 translate-y-8 scale-95 z-0 pointer-events-none'
                  }`}
                >
                  {item.text}
                </h2>
              ))}
            </div>
            <div className="mt-2 flex items-center justify-center gap-2">
              {carouselItems.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setMockupIndex(i)}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    i === mockupIndex ? 'w-8 bg-white' : 'w-2 bg-white/35 hover:bg-white/50'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="absolute top-[28%] left-[8%] w-[130%] max-w-[1000px] -rotate-[4deg]">
            <img src={carouselItems[0].image} className="invisible w-full" aria-hidden="true" alt="" />
            {carouselItems.map((item, i) => (
              <img
                key={item.image}
                src={item.image}
                alt={`CRM dashboard preview ${i + 1}`}
                className={`absolute top-0 left-0 w-full rounded-3xl border-8 border-blue-200 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] shadow-blue-950/30 transition-all duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${
                  i === mockupIndex
                    ? 'opacity-100 translate-x-0 scale-100 z-10'
                    : i < mockupIndex
                      ? 'opacity-0 -translate-x-16 scale-[0.96] z-0 pointer-events-none'
                      : 'opacity-0 translate-x-16 scale-[0.96] z-0 pointer-events-none'
                }`}
              />
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
