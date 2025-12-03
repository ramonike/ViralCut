import React from "react";
import { TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { UploadQueuePanel } from "./UploadQueuePanel";
import { CalendarWidget } from "./CalendarWidget";

export function SidebarRight({ state, actions }) {
    const { uploadQueue, history, analytics } = state;
    const {
        addToUploadQueue,
        markQueueStatus,
        removeQueueItem,
        rescheduleVideo,
        moveVideoInHistory,
        updateVideoMetadata,
        removeHistoryItem
    } = actions;

    const getAnalyticsData = () => {
        const days = [];
        const today = new Date();
        const fetchedData = analytics?.views24h || [];

        const dataMap = {};
        fetchedData.forEach(item => {
            dataMap[item.name] = item.views;
        });

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);

            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const dateStr = `${day}/${month}`;

            days.push({
                name: dateStr,
                views: dataMap[dateStr] || 0
            });
        }
        return days;
    };

    const analyticsData = getAnalyticsData();

    return (
        <aside className="md:col-span-3 flex flex-col gap-6 animate-in slide-in-from-right-4 duration-500">
            {/* Upload Queue */}
            <UploadQueuePanel
                uploadQueue={uploadQueue}
                markQueueStatus={markQueueStatus}
                removeQueueItem={removeQueueItem}
            />

            {/* Calendar */}
            <CalendarWidget
                history={history}
                uploadQueue={uploadQueue}
                addToUploadQueue={addToUploadQueue}
                rescheduleVideo={rescheduleVideo}
                moveVideoInHistory={moveVideoInHistory}
                updateVideoMetadata={updateVideoMetadata}
                removeHistoryItem={removeHistoryItem}
            />

            {/* Analytics */}
            <div className="glass-panel rounded-xl overflow-hidden">
                <div className="p-4 border-b border-surface-700/50 flex items-center justify-between">
                    <h3 className="font-bold text-white text-lg flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-success" /> Performance
                    </h3>
                    <span className="text-[10px] font-bold bg-success/10 text-success px-2 py-1 rounded border border-success/20">
                        +12.5%
                    </span>
                </div>
                <div className="p-4">
                    <div style={{ height: 180, width: "100%" }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analyticsData}>
                                <defs>
                                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    stroke="#64748b"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1e293b',
                                        border: '1px solid #334155',
                                        borderRadius: '8px',
                                        fontSize: '12px'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="views"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    fill="url(#colorViews)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </aside>
    );
}
