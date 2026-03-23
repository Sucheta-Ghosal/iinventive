import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function AnalyticsTracker() {
    const location = useLocation();

    useEffect(() => {
        window.gtag("config", "G-NR7P3HZTGN", {
            page_path: location.pathname,
        });
    }, [location]);

    return null;
}

export default AnalyticsTracker;