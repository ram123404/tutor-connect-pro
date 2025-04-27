
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  Calendar,
  Home,
  Search,
  BookOpen,
  Users,
  UserPlus,
  Settings,
  Shield,
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const role = user?.role;

  const tutorLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
    { href: '/requests', label: 'Tuition Requests', icon: <BookOpen className="w-5 h-5" /> },
    { href: '/profile', label: 'My Profile', icon: <Users className="w-5 h-5" /> },
  ];

  const studentLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
    { href: '/tutors', label: 'Find Tutors', icon: <Search className="w-5 h-5" /> },
    { href: '/request-tuition', label: 'Request Tuition', icon: <UserPlus className="w-5 h-5" /> },
    { href: '/bookings', label: 'My Bookings', icon: <Calendar className="w-5 h-5" /> },
    { href: '/profile', label: 'My Profile', icon: <Users className="w-5 h-5" /> },
  ];

  const adminLinks = [
    { href: '/admin', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
    { href: '/admin/users', label: 'Users', icon: <Users className="w-5 h-5" /> },
    { href: '/admin/requests', label: 'Requests', icon: <BookOpen className="w-5 h-5" /> },
    { href: '/admin/settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
    { href: '/admin/approvals', label: 'Approvals', icon: <Shield className="w-5 h-5" /> },
  ];

  let links = studentLinks;
  if (role === 'tutor') links = tutorLinks;
  if (role === 'admin') links = adminLinks;

  return (
    <div className="fixed inset-y-0 left-0 z-10 w-64 transform transition duration-300 ease-in-out bg-white border-r border-gray-200 pt-16 hidden md:block">
      <div className="py-4">
        <div className="px-4 py-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {role?.toUpperCase()}
          </p>
        </div>

        <nav className="mt-5 px-2 space-y-1">
          {links.map((link, index) => {
            const isActive = location.pathname === link.href;

            return (
              <Link
                key={index}
                to={link.href}
                className={cn(
                  "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors",
                  {
                    "bg-primary/10 text-primary": isActive,
                    "text-gray-700 hover:bg-primary/5 hover:text-primary": !isActive,
                  }
                )}
              >
                <span className={cn("mr-3", { "text-primary": isActive })}>{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
