import { Link, useLocation } from 'react-router-dom';
import { Compass, MapPin } from 'lucide-react';

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-ocean-900/95 backdrop-blur-sm border-b border-ocean-700/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group"
        >
          <div className="w-8 h-8 bg-sand-300 rounded-lg flex items-center justify-center group-hover:bg-sand-200 transition-colors">
            <Compass size={18} className="text-ocean-900" />
          </div>
          <span className="font-display text-lg font-bold text-white tracking-wide">
            Smart Trip
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          <Link
            to="/"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-body font-medium transition-colors ${
              pathname === '/'
                ? 'bg-ocean-700 text-white'
                : 'text-ocean-200 hover:text-white hover:bg-ocean-800'
            }`}
          >
            <MapPin size={14} />
            Мої подорожі
          </Link>
        </div>
      </div>
    </nav>
  );
}
