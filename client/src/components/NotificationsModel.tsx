import { X } from "lucide-react";
import { useQuery, useMutation } from "@apollo/client/react";
import Button from "./ui/Button";
import { MY_NOTIFICATIONS_QUERY } from "../graphql/queries";
import {
  MARK_NOTIFICATION_READ_MUTATION,
  MARK_ALL_NOTIFICATIONS_READ_MUTATION,
} from "../graphql/mutations";
import { mapNotification, type NotificationNode } from "../adapters/notification";

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationsModal({
  isOpen,
  onClose,
}: NotificationsModalProps) {
  const { data, loading, error } = useQuery<{ myNotifications: NotificationNode[] }>(
    MY_NOTIFICATIONS_QUERY,
    { skip: !isOpen },
  );

  const refetchQueries = [{ query: MY_NOTIFICATIONS_QUERY }];
  const [markRead] = useMutation(MARK_NOTIFICATION_READ_MUTATION, { refetchQueries });
  const [markAllRead, { loading: markingAll }] = useMutation(
    MARK_ALL_NOTIFICATIONS_READ_MUTATION,
    { refetchQueries },
  );

  if (!isOpen) return null;

  const notifications = (data?.myNotifications ?? []).map(mapNotification);
  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkRead = async (id: string) => {
    try {
      await markRead({ variables: { id } });
    } catch {
      // ignore — list will stay as-is
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllRead();
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-100 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-bg-base w-full max-w-md rounded-xl shadow-2xl flex flex-col max-h-[85vh]">
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

        <div className="overflow-y-auto divide-y divide-border-muted flex-1">
          {loading && (
            <p className="p-8 text-center text-sm text-fg-muted">Loading notifications…</p>
          )}
          {error && (
            <p className="p-8 text-center text-sm text-danger">
              Failed to load notifications: {error.message}
            </p>
          )}
          {!loading && !error && notifications.length === 0 && (
            <p className="p-8 text-center text-sm text-fg-muted">No notifications yet.</p>
          )}
          {notifications.map((notification) => {
            const Icon = notification.icon;
            return (
              <div
                key={notification.id}
                onClick={() => notification.unread && handleMarkRead(notification.id)}
                className={`p-5 flex items-start gap-4 hover:bg-bg-light transition-colors cursor-pointer ${
                  notification.unread ? "bg-bg-light/50" : ""
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${notification.bg} ${notification.color}`}
                >
                  <Icon size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4
                      className={`text-sm ${
                        notification.unread
                          ? "font-bold text-fg"
                          : "font-medium text-fg-muted"
                      }`}
                    >
                      {notification.title}
                    </h4>
                    <span className="text-xs text-fg-muted whitespace-nowrap ml-2">
                      {notification.time}
                    </span>
                  </div>
                  <p className="text-xs text-fg-muted leading-relaxed">{notification.desc}</p>
                </div>
                {notification.unread && (
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t border-border-muted bg-bg-base rounded-b-xl flex justify-center sticky bottom-0">
          <Button
            variant="secondary"
            className="w-full text-sm py-2"
            disabled={unreadCount === 0 || markingAll}
            onClick={handleMarkAllRead}
          >
            {markingAll ? "Marking…" : "Mark all as read"}
          </Button>
        </div>
      </div>
    </div>
  );
}
