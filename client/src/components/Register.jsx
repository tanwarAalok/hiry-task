import React, { useState } from 'react';
import {uploadMedia} from '../services/api.js';

const Register = ({ onRegister, error, setIsRegistering }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const [file, setFile] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onRegister({email, password, name, image});
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setFile(file);
            const formData = new FormData();
            formData.append('file', file);

            try {
                const data = await uploadMedia(formData)

                if (data) {
                    setImage(data.url);
                } else {
                    console.error('Upload failed:', data.error);
                }
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }
    };

    return (
        <div className="min-h-screen bg-login-page bg-no-repeat bg-cover flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4 text-center text-custom-orange">Register</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-orange"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
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
                    <div className="mb-4">
                        <label htmlFor="image" className="block text-gray-700 font-bold mb-2">
                            Image
                        </label>
                        <input
                            type="file"
                            id="image"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-orange"
                            onChange={handleImageChange}
                            required
                        />
                    </div>
                    {image && (
                        <img src={image} alt="Image preview" className="mt-4 max-w-xs"/>
                    )}
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <button
                        type="submit"
                        className="mt-4 w-full bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-custom-orange focus:ring-opacity-50"
                    >
                        Register
                    </button>
                    <p className="mt-2 text-center">Already have account ? <span className="cursor-pointer text-blue-700" onClick={() => setIsRegistering(false)}>Login</span></p>
                </form>
            </div>
        </div>
    );
};

export default Register;
