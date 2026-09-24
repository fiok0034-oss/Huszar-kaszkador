import React from 'react';
import {
  Bell,
  Check,
  CheckCheck,
  ExternalLink,
  Calendar,
  Sparkles,
  Info,
  Clock,
  Radio,
} from 'lucide-react';
import type { WorkspaceNotification } from '../../server/workspaceStorage';

interface NotificationsTabProps {
  notifications: WorkspaceNotification[];
  onMarkRead: (id: string) => Promise<void>;
  onMarkAllRead: () => Promise<void>;
  browserNotificationStatus: 'default' | 'granted' | 'denied';
  onRequestBrowserNotification: () => void;
}

export const NotificationsTab: React.FC<NotificationsTabProps> = ({
  notifications,
  onMarkRead,
  onMarkAllRead,
  browserNotificationStatus,
  onRequestBrowserNotification,
}) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleString('hu-HU', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const getIcon = (type: WorkspaceNotification['type']) => {
    switch (type) {
      case 'NEW_STUNT_OPPORTUNITY':
        return <Sparkles size={16} className="text-[#10b981]" />;
      case 'UPCOMING_DEADLINE':
        return <Calendar size={16} className="text-[#fbbf24]" />;
      case 'SOURCE_UPDATE':
      case 'PRODUCTION_UPDATE':
      default:
        return <Info size={16} className="text-[#38bdf8]" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="p-4 border border-[#232733] bg-[#0c0d10] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
              VALÓS RENDSZERÉRTESÍTÉSEK
            </span>
            {unreadCount > 0 && (
              <span className="font-mono text-[10px] bg-[#fbbf24] text-black font-bold px-1.5 py-0.5">
                {unreadCount} olvasatlan
              </span>
            )}
          </div>
          <p className="text-xs text-[#9ca3af] mt-1">
            Kizárólag valós eseményekről (új észlelések, közeledő határidők, forrásfrissülések). Nincsenek tesztüzenetek.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={onMarkAllRead}
              className="px-3 py-1.5 border border-[#2b303c] bg-[#161a22] hover:bg-[#202530] text-[#d1d5db] font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCheck size={14} />
              <span>Összes olvasottnak</span>
            </button>
          )}

          {browserNotificationStatus !== 'granted' && (
            <button
              type="button"
              onClick={onRequestBrowserNotification}
              className="px-3 py-1.5 border border-[#10b981]/40 bg-[#10b981]/10 hover:bg-[#10b981]/20 text-[#10b981] font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
            >
              <Bell size={13} />
              <span>Böngészős Értesítés Bekapcsolása</span>
            </button>
          )}
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="p-10 border border-[#232733] bg-[#0e1014] text-center space-y-3">
          <Bell size={28} className="mx-auto text-[#4b5563]" />
          <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
            Nincs még rögzített értesítés
          </h4>
          <p className="text-xs text-[#9ca3af] max-w-md mx-auto">
            A figyelőrendszer automatikusan értesítést generál, amint a beállított hivatalos forrásokból új kaszkadőri felhívás vagy határidő érkezik.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                notif.read
                  ? 'border-[#1b1e26] bg-[#0a0c0e] text-[#9ca3af]'
                  : 'border-[#2d3444] bg-[#11141c] text-[#d1d5db]'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 border border-[#232733] bg-[#08090b] shrink-0 mt-0.5">
                  {getIcon(notif.type)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-white">
                      {notif.title}
                    </span>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-[#fbbf24] animate-pulse" />
                    )}
                  </div>

                  <p className="text-xs leading-relaxed">
                    {notif.message}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] text-[#6b7280]">
                    <span>Idő: {formatDate(notif.timestamp)}</span>
                    {notif.sourceName && <span>Forrás: {notif.sourceName}</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                {notif.sourceUrl && (
                  <a
                    href={notif.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 border border-[#232733] hover:text-white hover:border-[#3e4556] text-[#9ca3af] font-mono text-xs"
                    title="Forrás megnyitása"
                  >
                    <ExternalLink size={13} />
                  </a>
                )}

                {!notif.read && (
                  <button
                    type="button"
                    onClick={() => onMarkRead(notif.id)}
                    className="px-2.5 py-1 border border-[#2b303c] bg-[#161a22] hover:bg-[#202530] text-[#9ca3af] hover:text-white font-mono text-[11px] cursor-pointer"
                  >
                    Olvasott
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
