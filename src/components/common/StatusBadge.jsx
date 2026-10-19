import "./StatusBadge.css";

/**
 * status: "success" | "warning" | "danger" | "info" | "neutral"
 */
export default function StatusBadge({ children, status = "neutral" }) {
  return (
    <span className={`status-badge status-${status}`}>
      {children}
    </span>
  );
}
