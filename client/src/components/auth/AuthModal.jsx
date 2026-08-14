import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeAuthModal, setAuthView } from '../../features/ui/uiSlice';
import { loginUser, registerUser } from '../../features/auth/authSlice';

const AuthModal = () => {
    const dispatch = useDispatch();
    const { showAuthModal, authView } = useSelector((state) => state.ui);

    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const [submitting, setSubmitting] = useState(false);

    if (!showAuthModal) return null;

    const isLogin = authView === 'login';

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const action = isLogin
            ? loginUser({ email: form.email, password: form.password })
            : registerUser({ username: form.username, email: form.email, password: form.password });

        const result = await dispatch(action);
        setSubmitting(false);

        if (result.meta.requestStatus === 'fulfilled') {
            setForm({ username: '', email: '', password: '' });
            dispatch(closeAuthModal());
        }
    };

    const closeModal = () => dispatch(closeAuthModal());

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4"
            onClick={closeModal}
        >
            <div
                className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-2xl p-8 relative shadow-xl transition-colors duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
                    onClick={closeModal}
                    aria-label="Close"
                >
                    ✕
                </button>

                <h2 className="text-2xl font-playfair text-center mb-1 text-gray-900 dark:text-gray-50">
                    {isLogin ? 'Welcome back' : 'Create your account'}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
                    {isLogin ? 'Log in to continue booking' : 'Sign up to start booking hotels'}
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {!isLogin && (
                        <div>
                            <label className="text-xs text-gray-500 dark:text-gray-400">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-md px-3 py-2 mt-1 outline-primary"
                                placeholder="John Doe"
                            />
                        </div>
                    )}

                    <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-md px-3 py-2 mt-1 outline-primary"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            minLength={6}
                            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-md px-3 py-2 mt-1 outline-primary"
                            placeholder="At least 6 characters"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-black dark:bg-white dark:text-black text-white py-2.5 rounded-full mt-2 transition-all duration-500 disabled:opacity-60 cursor-pointer"
                    >
                        {submitting ? 'Please wait...' : isLogin ? 'Login' : 'Sign Up'}
                    </button>
                </form>

                <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-5">
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                    <button
                        type="button"
                        className="text-primary font-medium cursor-pointer"
                        onClick={() => dispatch(setAuthView(isLogin ? 'signup' : 'login'))}
                    >
                        {isLogin ? 'Sign up' : 'Log in'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthModal;