import React, { useState } from 'react';

const Login = ({ onLogin, error, setIsRegistering }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onLogin(email, password);
    };

    return (
        <div className="min-h-screen bg-login-page bg-no-repeat bg-cover flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4 text-center text-custom-orange">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-orange"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-orange"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-custom-orange focus:ring-opacity-50"
                    >
                        Login
                    </button>
                    <p className="mt-2 text-center">Create a new account ? <span
                        className="cursor-pointer text-blue-700" onClick={() => setIsRegistering(true)}>Register</span>
                    </p>

                </form>
            </div>
        </div>
    );
};

export default Login;