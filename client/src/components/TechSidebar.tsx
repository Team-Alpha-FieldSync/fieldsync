import React from "react";
import {
  LayoutDashboard,
  Briefcase,
  Settings,
  HelpCircle,
  Search,
  ChevronDown
} from "lucide-react";
import Button from "./ui/Button"; 
import { Link } from "react-router";
import LogoutButton from "./LogoutButton";

export default function TechSidebar() {
  return (
    <aside className="w-64 min-h-screen flex flex-col bg-bg-dark text-fg font-sans border-r border-border-muted">
      
      {/* Logo Section */}
      <div className="flex items-center gap-3 p-6 pb-6">
        <div className="w-8 h-8 bg-bg-light border border-border-muted rounded-full shrink-0"></div>
        <h1 className="text-xl font-bold tracking-wide">FieldSync</h1>
      </div>

      {/* Technician Profile Section */}
      <div className="flex flex-col items-center px-6 mb-8 text-center">
        <img 
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=150&h=150" 
          alt="Technician" 
          className="w-30 h-30 rounded-full object-cover border-2 border-primary mb-3 shadow-sm"
        />
        <h2 className="text-base font-bold text-fg">Marcus Johnson</h2>
        <p className="text-xs font-medium text-fg-muted">Senior Technician</p>
      </div>

      {/* Main Menu */}
      <div className="px-6 space-y-4">
        <h2 className="text-[10px] font-bold text-fg-muted uppercase tracking-wider mb-2">
          Menu
        </h2>
        <nav className="space-y-4">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" to="/technician" />
          <NavItem icon={<Briefcase size={20} />} label="Jobs" to="/technician/jobs" />
          <NavItem icon={<Settings size={20} />} label="Setting" to="/technician" />
          <NavItem icon={<HelpCircle size={20} />} label="Help" to="/technician" />
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
      
      <LogoutButton/>
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