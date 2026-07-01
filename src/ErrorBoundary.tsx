import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  declare props: Props;
  state: State = { hasError: false };

  static getDerivedStateFromError(_error: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    try {
      localStorage.clear();
    } catch (e) {
      console.error("Failed to clear localStorage on reload:", e);
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          fontFamily: "Inter, system-ui, sans-serif",
          padding: "24px",
          textAlign: "center",
          backgroundColor: "#FAF6F0",
          color: "#2C1B18"
        }}>
          <div style={{
            maxWidth: "400px",
            padding: "40px 32px",
            borderRadius: "24px",
            backgroundColor: "#FFFFFF",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.01)",
            border: "1px solid #E6DFD5",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}>
            <div style={{
              fontSize: "3rem",
              marginBottom: "16px"
            }}>
              ☕⚠️
            </div>
            <h1 style={{
              fontSize: "1.5rem",
              fontWeight: "800",
              marginBottom: "12px",
              fontFamily: "serif",
              color: "#2C1B18"
            }}>
              Something went wrong
            </h1>
            <p style={{
              fontSize: "0.875rem",
              color: "#6F5E53",
              marginBottom: "24px",
              lineHeight: "1.5"
            }}>
              We couldn't load Dazeen Ecommerce. This might be due to corrupted data in your browser cache.
            </p>
            <button
              onClick={this.handleReload}
              style={{
                width: "100%",
                padding: "12px 24px",
                fontSize: "0.875rem",
                fontWeight: "700",
                cursor: "pointer",
                backgroundColor: "#2C1B18",
                color: "#FAF6F0",
                border: "none",
                borderRadius: "12px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
              }}
            >
              Clear Cache & Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
