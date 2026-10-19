import Sidebar from "./Sidebar";
import Header from "./Header";
import "./DashboardLayout.css";

export default function DashboardLayout({ children, title, subtitle }) {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <Header title={title} subtitle={subtitle} />
        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  );
}
