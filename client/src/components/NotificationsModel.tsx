import { X, Briefcase, AlertCircle, CheckCircle, UserPlus } from "lucide-react";
import Button from "./ui/Button"; 

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock Data for notifications
const mockNotifications = [
  {
    id: 1,
    type: "alert",
    title: "High Priority Job Added",
    desc: "A new critical networking issue at Acme Corp.",
    time: "5m ago",
    unread: true,
    icon: AlertCircle,
    color: "text-danger",
    bg: "bg-danger/10",
  },
  {
    id: 2,
    type: "success",
    title: "Job Completed",
    desc: "Marcus Johnson finished JOB-101.",
    time: "1h ago",
    unread: true,
    icon: CheckCircle,
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    id: 3,
    type: "assignment",
    title: "Tech Assigned",
    desc: "Sarah Connor assigned to HVAC Maintenance.",
    time: "2h ago",
    unread: false,
    icon: Briefcase,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    id: 4,
    type: "system",
    title: "New Technician Joined",
    desc: "John Smith has completed onboarding.",
    time: "1d ago",
    unread: false,
    icon: UserPlus,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
];

export default function NotificationsModal({
  isOpen,
  onClose,
}: NotificationsModalProps) {
  if (!isOpen) return null;

  const unreadCount = mockNotifications.filter((n) => n.unread).length;

  return (
    <div className="fixed inset-0 bg-black/60 z-100 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-bg-base w-full max-w-md rounded-xl shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-border-muted flex items-center justify-between sticky top-0 bg-bg-base rounded-t-xl z-10">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-fg">Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount} New
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-fg-muted hover:text-fg hover:bg-bg-light rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Notification List */}
        <div className="overflow-y-auto divide-y divide-border-muted">
          {mockNotifications.map((notification) => {
            const Icon = notification.icon;
            return (
              <div
                key={notification.id}
                className={`p-5 flex items-start gap-4 hover:bg-bg-light transition-colors cursor-pointer ${notification.unread ? "bg-bg-light/50" : ""}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${notification.bg} ${notification.color}`}
                >
                  <Icon size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4
                      className={`text-sm ${notification.unread ? "font-bold text-fg" : "font-medium text-fg-muted"}`}
                    >
                      {notification.title}
                    </h4>
                    <span className="text-xs text-fg-muted whitespace-nowrap ml-2">
                      {notification.time}
                    </span>
                  </div>
                  <p className="text-xs text-fg-muted leading-relaxed">
                    {notification.desc}
                  </p>
                </div>
                {/* Unread indicator dot */}
                {notification.unread && (
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border-muted bg-bg-base rounded-b-xl flex justify-center sticky bottom-0">
          <Button variant="secondary" className="w-full text-sm py-2">
            Mark all as read
          </Button>
        </div>
      </div>
    </div>
  );
}
