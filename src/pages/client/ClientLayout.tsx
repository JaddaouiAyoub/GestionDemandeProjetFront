import { NavLink, Outlet } from 'react-router-dom';
import {
  FaTachometerAlt, FaLink, FaBars, FaCalendarAlt, FaInfoCircle,
  FaServicestack, FaEnvelope, FaTimes,
  FaLock,
  FaSignOutAlt
} from 'react-icons/fa';
import { logout } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

export default function ClientLayout() {
    const navigate = useNavigate();
      const handleLogout = () => {
        logout()
        // toast.info('Déconnecté avec succès')
        navigate('/login')
      }
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-[#04293A] text-white flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-[#064663]">
          <img src="/logo.jpeg" alt="Logo" className="h-20 mx-auto mb-4" />
        </div>

        <nav className="flex-1">
          <NavItem to="dashboard" icon={<FaTachometerAlt />} label="Dashboard" />
          <NavItem to="mes-demandes" icon={<FaLink />} label="Mes demandes" />
          <NavItem to="overview" icon={<FaBars />} label="Overview" />
          <NavItem to="events" icon={<FaCalendarAlt />} label="Events" />
          <NavItem to="about" icon={<FaInfoCircle />} label="About" />
          <NavItem to="services" icon={<FaServicestack />} label="Services" />
          <NavItem to="contact" icon={<FaEnvelope />} label="Contact" />
        </nav>

<button
  onClick={handleLogout}
  className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
>
  <FaSignOutAlt className="text-lg" />
  <span>Se déconnecter</span>
</button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gradient-to-br from-blue-300 to-indigo-400 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

function NavItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-6 py-4 transition-all ${
          isActive ? 'bg-[#064663] text-white font-semibold' : 'hover:bg-[#064663] hover:text-white'
        }`
      }
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
}
