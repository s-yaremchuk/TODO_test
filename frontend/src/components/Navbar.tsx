import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-[#111111] border-b border-neutral-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between h-14 items-center">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs px-2 py-1 bg-[#FFD400] text-black font-bold uppercase tracking-wider">
              TODO
            </span>
            <span className="font-sans font-extrabold tracking-tight text-white uppercase text-sm">
              TASKFLOW
            </span>
          </div>

          {user && (
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-neutral-400">
                USER: <span className="text-white font-medium">{user.name}</span>
              </span>
              <button
                onClick={logout}
                className="font-mono text-xs uppercase px-3 py-1.5 border border-neutral-700 bg-[#161616] text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors duration-100"
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
