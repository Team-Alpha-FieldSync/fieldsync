import React from "react";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Settings,
  HelpCircle,
  Search,
  ChevronDown
} from "lucide-react";
import Button from "./ui/Button"; 
import LogoutButton from "./LogoutButton";
import { Link } from "react-router";

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen flex flex-col bg-bg-dark text-fg font-sans border-r border-border-muted">
      
      {/* Logo Section */}
      <div className="flex items-center gap-3 p-6 pb-8">
        <div className="w-8 h-8 bg-bg-light border border-border-muted rounded-full shrink-0"></div>
        <h1 className="text-xl font-bold tracking-wide">FieldSync</h1>
      </div>

      {/* Main Menu */}
      <div className="px-6 space-y-4">
        <h2 className="text-[10px] font-bold text-fg-muted uppercase tracking-wider mb-2">
          Menu
        </h2>
        <nav className="space-y-4">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" to="/admin" />
          <NavItem icon={<Briefcase size={20} />} label="Jobs" to="/admin/jobs" />
          <NavItem icon={<Users size={20} />} label="Technicians" to="/admin/technicians" />
          <NavItem icon={<Settings size={20} />} label="Setting" to="/admin" />
          <NavItem icon={<HelpCircle size={20} />} label="Help" to="/admin" />
        </nav>
      </div>

      {/* Divider */}
      <div className="mt-8 mb-6 border-t border-border-muted mx-6"></div>

      {/* Technician Filters */}
      <div className="px-6 flex-1">
        <h2 className="text-[10px] font-bold text-fg-muted uppercase tracking-wider mb-4">
          Technician Filters
        </h2>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-fg">Search</label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
              <input
                type="text"
                placeholder="Search jobs..."
                className="w-full bg-bg-base border border-border text-sm text-fg rounded-md py-2.5 pl-9 pr-3 focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-fg-muted transition-colors"
              />
            </div>
          </div>

          {/* Dropdown Filters */}
          <FilterSelect label="Status" placeholder="All Status" />
          <FilterSelect label="Technician" placeholder="All Technicians" />
          <FilterSelect label="Priority" placeholder="All Priorities" />
        </div>
      </div>

      {/* Apply Filters Button using your Component Library */}
      <div className="p-6">
        <Button variant="primary" className="w-full">
          Apply Filters
        </Button>
      </div>
      
    </aside>
  );
}

// --- Helper Components ---

function NavItem({ icon, label, to }: { icon: React.ReactNode; label: string; to: string }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 text-fg-muted hover:text-fg transition-colors group"
    >
      <span className="text-fg-muted group-hover:text-primary transition-colors">
        {icon}
      </span>
      <span className="font-medium text-sm">{label}</span>
    </Link>
  );
}

function FilterSelect({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-fg">{label}</label>
      <div className="relative">
        <select className="w-full bg-bg-base border border-border text-sm text-fg rounded-md py-2.5 pl-3 pr-10 appearance-none focus:outline-none focus:ring-1 focus:ring-primary transition-colors cursor-pointer">
          <option value="">{placeholder}</option>
        </select>
        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none" />
      </div>
    </div>
  );
}