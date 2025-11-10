import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { UserRole } from '../types';

const LeafIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12.001 2C6.478 2 2 6.477 2 11.999c0 5.522 4.478 9.999 10.001 9.999 1.833 0 3.55-.492 5.064-1.352-1.22-1.46-1.92-3.32-1.92-5.32 0-4.646 3.76-8.406 8.406-8.406.01 0 .02 0 .03-.001C21.782 3.32 17.23 2 12.001 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8c.34 0 .68.02 1.01.07-3.92 1.4-6.79 5.06-6.79 9.3s2.87 7.9 6.79 9.3c-.33.05-.67.07-1.01.07z"/>
    </svg>
);

const LoginForm: React.FC<{ role: UserRole }> = ({ role }) => {
    const { login } = useAppContext();
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!name.trim() || !mobile.trim()) {
            setError('Both name and mobile number are required.');
            return;
        }
        const success = login(name, mobile, role);
        if (!success) {
            setError('Invalid credentials. Please check your details and try again.');
        }
    };

    const isSeller = role === UserRole.SELLER;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor={`${role}-name`} className="block text-sm font-medium text-gray-700">Name</label>
                <div className="mt-1">
                    <input
                        id={`${role}-name`}
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={isSeller ? "Seller" : "Your Name or Shop Name"}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                </div>
            </div>

            <div>
                <label htmlFor={`${role}-mobile`} className="block text-sm font-medium text-gray-700">Mobile Number</label>
                <div className="mt-1">
                    <input
                        id={`${role}-mobile`}
                        name="mobile"
                        type="tel"
                        autoComplete="tel"
                        required
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder={isSeller ? "0000000000" : "10-digit mobile number"}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            
            {isSeller && <p className="text-xs text-gray-500">Hint: For this demo, use Name: Seller, Mobile: 0000000000</p>}

            <div>
                <button
                    type="submit"
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isSeller ? 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-500' : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'} focus:outline-none focus:ring-2 focus:ring-offset-2`}
                >
                    Sign in
                </button>
            </div>
        </form>
    );
};

export const LoginView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<UserRole>(UserRole.CUSTOMER);

    return (
        <div className="min-h-screen bg-green-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center items-center">
                    <LeafIcon className="h-12 w-auto text-green-600" />
                    <h2 className="ml-3 text-center text-3xl font-extrabold text-gray-900">Sign in to Prabha Vegetables</h2>
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
                    <div>
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                <button
                                    onClick={() => setActiveTab(UserRole.CUSTOMER)}
                                    className={`${activeTab === UserRole.CUSTOMER ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                                >
                                    Customer Login
                                </button>
                                <button
                                    onClick={() => setActiveTab(UserRole.SELLER)}
                                    className={`${activeTab === UserRole.SELLER ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                                >
                                    Seller Login
                                </button>
                            </nav>
                        </div>
                    </div>
                    <div className="pt-6">
                        {activeTab === UserRole.CUSTOMER ? <LoginForm role={UserRole.CUSTOMER} /> : <LoginForm role={UserRole.SELLER} />}
                    </div>
                </div>
            </div>
        </div>
    );
};