import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-indigo-600">✓</span>
            <span className="text-xl font-bold text-gray-900">TaskFlow</span>
          </div>

          {user && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Привіт, <strong className="text-gray-900">{user.name}</strong>
              </span>
              <button
                onClick={logout}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Вийти
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
