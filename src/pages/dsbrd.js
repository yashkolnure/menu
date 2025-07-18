import React, { useState, useEffect, useCallback } from "react";

const useStyles = () => ({
  container: {
    display: "flex",
    height: "100vh",
    overflow: "hidden",
    fontFamily: "Poppins, sans-serif",
  },
  sidebar: {
    width: "240px",
    backgroundColor: "#111317",
    color: "#fff",
    padding: "20px",
  },
  title: {
    marginBottom: "30px",
    fontSize: "20px",
    color: "#f9ac54",
  },
  link: (isActive) => ({
    display: "block",
    padding: "12px 15px",
    color: isActive ? "#111317" : "#ccc",
    backgroundColor: isActive ? "#f9ac54" : "transparent",
    textDecoration: "none",
    marginBottom: "10px",
    borderRadius: "6px",
    transition: "background 0.3s, color 0.3s",
    cursor: "pointer",
  }),
  mainContent: {
    flexGrow: 1,
    backgroundColor: "#f4f4f4",
    position: "relative",
  },
  iframe: {
    width: "100%",
    height: "100%",
    border: "none",
    display: "block",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#ffffffcc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
    fontSize: "18px",
    fontWeight: "500",
    color: "#333",
  },
  errorOverlay: {
    textAlign: "center",
    paddingTop: "100px",
    fontSize: "18px",
    color: "#ff4444",
  },
});

const MENU_ITEMS = [
  { name: "Add / Edit Restaurant", url: "https://menu-coral-tau.vercel.app/dsbrdadmin1" },
  { name: "Restaurant Login", url: "https://panel.avenirya.com/restaurant-login" },
  { name: "Edit Menu", url: "https://panel.avenirya.com/menu-editor" },
  { name: "Logout", action: "logout" },
];

const Dsbrd = () => {
  const styles = useStyles();
  const [iframeUrl, setIframeUrl] = useState(MENU_ITEMS[0].url);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleClick = useCallback((item) => {
    if (item.action === "logout") {
      if (window.confirm("Are you sure you want to logout?")) {
        // Clear any local/session data here if needed
        window.location.href = "https://panel.avenirya.com/logout"; // your logout route
      }
    } else {
      setIframeUrl(item.url);
      setIsLoading(true);
      setHasError(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) setHasError(true); // Simulate error if iframe doesn't load
    }, 8000); // 8 seconds

    return () => clearTimeout(timer);
  }, [iframeUrl, isLoading]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar} aria-label="Sidebar Navigation">
        <h2 style={styles.title}>📊 Dashboard</h2>
        {MENU_ITEMS.map((item) => (
          <div
            key={item.name}
            style={styles.link(iframeUrl === item.url)}
            onClick={() => handleClick(item)}
            role="button"
            tabIndex={0}
            aria-pressed={iframeUrl === item.url}
            onKeyDown={(e) => e.key === "Enter" && handleClick(item)}
          >
            {item.name}
          </div>
        ))}
      </aside>

      <main style={styles.mainContent}>
        {isLoading && !hasError && (
          <div style={styles.loadingOverlay}>⏳ Loading...</div>
        )}

        {hasError ? (
          <div style={styles.errorOverlay}>
            ❌ Failed to load content.<br />
            The site may not allow embedding or the URL is incorrect.
          </div>
        ) : (
          <iframe
            title="Dashboard Frame"
            src={iframeUrl}
            onLoad={handleLoad}
            style={styles.iframe}
          />
        )}
      </main>
    </div>
  );
};

export default Dsbrd;
