import React from "react";
import {
  LayoutDashboard,
  Briefcase,
  Search,
  ChevronDown,
  X,
} from "lucide-react";
import Button from "./ui/Button";
import { NavLink } from "react-router-dom";
import LogoutButton from "./LogoutButton";

interface TechSidebarProps {
  onClose?: () => void;
}

export default function TechSidebar({ onClose }: TechSidebarProps) {
  return (
    <aside className="w-full md:w-64 h-full flex flex-col bg-bg-dark text-fg font-sans border-r border-border-muted overflow-y-auto shadow-xl md:shadow-none relative">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-fg-muted hover:text-fg md:hidden bg-bg-base/10 rounded-full"
        >
          <X size={20} />
        </button>
      )}
      {/* Logo Section */}
      <div className="flex items-center gap-3 p-6 pb-6">
        <div className="w-8 h-8 bg-bg-light border border-border-muted rounded-full shrink-0"></div>
        <h1 className="text-xl font-bold tracking-wide">FieldSync</h1>
      </div>

      {/* Technician Profile Section */}
      <div className="flex flex-col items-center px-6 mb-8 text-center">
        <img
          src="https://images.unsplash.com/photo-1657356217673-4f7000f768b4?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
          <div onClick={onClose}>
            <NavItem
              icon={<LayoutDashboard size={20} />}
              label="Dashboard"
              to="/technician"
              end
            />
          </div>
          <div onClick={onClose}>
            <NavItem
              icon={<Briefcase size={20} />}
              label="Jobs"
              to="/technician/jobs"
            />
          </div>
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
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-primary"
              />
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

      {/* Apply Filters Button  */}
      <div className="p-6 pt-4 mt-auto space-y-4">
        <Button variant="primary" className="w-full">
          Apply Filters
        </Button>
        
        <LogoutButton />

      </div>

      
    </aside>
  );
}

// --- Helper Components ---

function NavItem({
  icon,
  label,
  to,
  end = false,
}: {
  icon: React.ReactNode;
  label: string;
  to: string;
  end?: boolean;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 transition-colors group rounded-lg px-3 py-2 -mx-3 ${
          isActive
            ? "text-fg bg-primary/10 border border-primary/20"
            : "text-fg-muted hover:text-fg"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={`transition-colors ${
              isActive
                ? "text-primary"
                : "text-fg-muted group-hover:text-primary"
            }`}
          >
            {icon}
          </span>
          <span className="font-medium text-sm">{label}</span>
        </>
      )}
    </NavLink>
  );
}

function FilterSelect({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-fg">{label}</label>
      <div className="relative">
        <select className="w-full bg-bg-base border border-border text-sm text-fg rounded-md py-2.5 pl-3 pr-10 appearance-none focus:outline-none focus:ring-1 focus:ring-primary transition-colors cursor-pointer">
          <option value="">{placeholder}</option>
        </select>
        <ChevronDown
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none"
        />
      </div>
    </div>
  );
}
