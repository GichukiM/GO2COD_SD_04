import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="bg-gray-900 text-white py-4 px-6 shadow-md">
      <div className="flex justify-between items-center w-full container mx-auto">
        {/* Logo on the left */}
        <h1 className="text-2xl font-bold no-underline">
          <Link to="/" className="no-underline inline-block">
            RPS
          </Link>
        </h1>

        {/* Links on the right */}
        <div className="space-x-4 flex">
          <Link to="/" className="inline-block mr-8">
            <button className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-semibold py-2 px-4 rounded">
              Solo
            </button>
          </Link>
          <Link to="/multiplayer" className="inline-block">
            <button className="bg-blue-500 hover:bg-blue-400 text-white font-semibold py-2 px-4 rounded">
              Multiplayer
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
