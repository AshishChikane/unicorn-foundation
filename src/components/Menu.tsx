import React from "react";
import { cn } from "@/lib/utils";

type MenuItem = "assignWallet" | "bridge" | "transfer";

interface Props {
  activeMenu: MenuItem;
  onChange: (menu: MenuItem) => void;
}

const MENU_ITEMS: { label: string; value: MenuItem }[] = [
  { label: "Assign Wallet", value: "assignWallet" },
  { label: "Deposit / Withdraw", value: "bridge" },
  { label: "Transfer", value: "transfer" },
];

const Menu: React.FC<Props> = ({ activeMenu, onChange }) => {
  const activeIndex = MENU_ITEMS.findIndex((item) => item.value === activeMenu);

  return (
    <div className="relative w-full px-4 sm:px-6" role="tablist">
      <div className="relative flex overflow-hidden rounded-xl border border-card-border bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 max-w-lg mx-auto shadow-lg shadow-primary/20 backdrop-blur-lg">
        <div
          className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-br from-primary/90 via-primary/70 to-accent/80 rounded-xl border border-primary/40 shadow-lg shadow-primary/30 transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(${activeIndex * 100}%)`,
          }}
        />

        {MENU_ITEMS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => onChange(value)}
            className={cn(
              "relative z-10 text-nowrap flex-1 px-4 sm:px-6 py-2 sm:py-2.5 text-sm font-medium transition-all duration-300 focus:outline-none",
              activeMenu === value
                ? "text-black font-semibold"
                : "text-slate-300 hover:text-white hover:scale-105"
            )}
            role="tab"
            aria-selected={activeMenu === value}
            type="button"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Menu;
