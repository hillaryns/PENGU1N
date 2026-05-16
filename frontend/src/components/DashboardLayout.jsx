import { NavLink, Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Chatbox from './Chatbox';
import GlobalTopBar from './GlobalTopBar';
import SidebarProfile from './profile/SidebarProfile';

const navItems = [
  { to: '/dashboard', icon: 'fa-home', label: 'Dashboard' },
  { to: '/subjects', icon: 'fa-book-open', label: 'Subjects' },
  { to: '/notes', icon: 'fa-sticky-note', label: 'Notes' },
  { to: '/practice', icon: 'fa-brain', label: 'Practice' },
  { to: '/tests', icon: 'fa-clipboard-check', label: 'Tests' },
  { to: '/classes', icon: 'fa-video', label: 'Classes' },
  { to: '/internships', icon: 'fa-briefcase', label: 'Internships' },
  { to: '/profile', icon: 'fa-user', label: 'Profile' },
];

export default function DashboardLayout() {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo">
            PENGU1N
          </Link>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `sidebar-link${isActive ? ' active' : ''}`
              }
              end={item.to === '/dashboard'}
            >
              <i className={`fas ${item.icon}`} /> {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <SidebarProfile />
        </div>
      </aside>

      <main className="main-content">
        <GlobalTopBar />
        <Outlet />
      </main>

      <Chatbox />
    </div>
  );
}
