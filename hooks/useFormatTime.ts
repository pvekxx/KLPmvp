export function useFormatTime() {
    return (ts?: any) => {
        const d: Date | null = ts?.toDate ? ts.toDate() : null;
        if (!d) return "";
        return d.toLocaleString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
    };
}