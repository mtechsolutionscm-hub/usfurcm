import { useState } from "react";
import { Menu, X } from "lucide-react";

interface MobileSidebarProps {
  children: React.ReactNode;
}

const MobileSidebar = ({ children }: MobileSidebarProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-50 p-2 rounded-lg bg-card border border-border shadow-sm"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 bg-foreground/30 z-40 lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col transform transition-transform lg:relative lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setOpen(false)}
          className="lg:hidden absolute top-3 right-3 p-1 rounded hover:bg-muted z-10"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="flex flex-col h-full overflow-y-auto" onClick={() => setOpen(false)}>
          {children}
        </div>
      </aside>
    </>
  );
};

export default MobileSidebar;
