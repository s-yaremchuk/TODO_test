import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Панель завдань
          </h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Керування списком завдань.
          </p>
        </div>
      </main>
    </div>
  );
};
