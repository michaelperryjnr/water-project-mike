import React, { useState } from 'react';
import { BsAt, Bs123 } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

function Login() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const endPointUrl = `${apiUrl}/auth/login`;
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Added loading state
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true during API call

    try {
      const response = await axios.post(endPointUrl, {
        identifier: identifier,
        password: password,
      });

      const { accessToken, refreshToken, user } = response.data;

      // Store tokens in local storage (temporary; switch to secure HTTP-only cookies in production)
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      // Show success toast
      await Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Login successful!',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });

      // Navigate to analytics after showing the toast
      navigate('/analytics');
    } catch (error) {
      console.error('Error during login:', error);

      // Check for specific status codes in the error response
      if (error.response) {
        const { status, data } = error.response;

        if (status === 400) {
          Swal.fire({
            icon: 'error',
            title: 'Bad Request',
            text: data.message || 'Please check your input and try again.',
            timer: 3000,
          });
        } else if (status === 401) {
          Swal.fire({
            icon: 'error',
            title: 'Invalid Credentials',
            text: 'Please check your email, staff number, or password.',
            timer: 3000,
          });
        } else if (status === 404) {
          Swal.fire({
            icon: 'error',
            title: 'User Not Found',
            text: 'No account exists with this identifier.',
            timer: 3000,
          });
        } else if (status === 500) {
          Swal.fire({
            icon: 'error',
            title: 'Server Error',
            text: 'Something went wrong on the server. Please try again later.',
            timer: 3000,
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops!',
            text: data.message || 'An unexpected error occurred.',
            timer: 3000,
          });
        }
      } else {
        // Network error or other issues
        Swal.fire({
          icon: 'error',
          title: 'Network Error',
          text: 'Unable to connect to the server. Please check your internet connection.',
          timer: 3000,
        });
      }
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <section className="relative flex flex-wrap lg:h-screen lg:items-center">
      <div className="w-full px-4 py-12 sm:px-6 sm:py-16 lg:w-1/2 lg:px-8 lg:py-24">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-30 w-auto"
            src="/Media/Taurean IT Logo1-2_vectorized.png"
            alt="Taurean IT Logistics"
          />
        </div>

        <div className="mx-auto max-w-lg text-center">
          <h1 className="text-2xl font-bold sm:text-3xl">Taurean ERP Dashboard</h1>
          <p className="mt-4 text-gray-500">
            Welcome to the Taurean ERP Dashboard. Secure login required to manage payroll, inventory, and more.
          </p>
        </div>

        <form onSubmit={handleLogin} className="mx-auto mb-0 mt-8 max-w-md space-y-4">
          <div>
            <label htmlFor="identifier" className="sr-only">
              Identifier
            </label>
            <div className="relative">
              <input
                type="text"
                name="identifier"
                id="identifier"
                required
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm focus:ring-taureanOrange focus:border-taureanOrange"
                placeholder="Email/ Staff Number/ Username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />

              <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                <BsAt className="text-taureanOrange" fill="currentColor" size={24} />
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                name="password"
                id="password"
                required
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm focus:ring-taureanOrange focus:border-taureanOrange"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                <Bs123 className="text-taureanOrange" fill="currentColor" size={24} />
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              No account?{' '}
              <Link className="underline" to={'/signup'}>
                Sign up
              </Link>
            </p>

            <button
              type="submit"
              className="inline-block rounded-lg bg-taureanOrange hover:bg-taureanLightBlue px-5 py-3 text-sm font-medium text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>

      <div className="w-full lg:w-1/2 px-4">
        <div className="relative max-w-md lg:max-w-2xl mx-auto lg:mr-0">
          <img
            className="block h-full w-full rounded-md lg:rounded-full"
            src="/Media/DALL·E-2.png"
            alt="Taurean IT Logistics Hero image"
          />
          <div className="absolute bottom-0 w-full left-0 p-4 lg:px-12 xl:px-20 sm:pb-16">
            <div className="p-10 backdrop-blur-md backdrop-filter bg-black bg-opacity-30 lg:rounded-full">
              <p className="text-white font-medium mb-6">
                "We poured everything into this platform — and it shows. Within the first week of going live, we saw client engagement and real business results. This isn’t just software; it’s a reflection of our commitment to helping companies thrive."
              </p>
              <div className="flex items-start">
                <div className="ml-4">
                  <span className="block text-white font-medium leading-none">Daniel Osei-Tutu Abrokwa</span>
                  <span className="text-xs text-white opacity-50">Founding Partner & CEO</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;