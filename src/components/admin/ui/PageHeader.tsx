import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export default function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="mb-8 flex justify-between items-center flex-wrap gap-4">
      <div>
        <h2 className="text-3xl font-bold text-[#D8C3A5]">{title}</h2>
        {subtitle && <p className="text-[#D8C3A5]/70 mt-2">{subtitle}</p>}
      </div>
      {actions && <div className="flex gap-3 flex-wrap">{actions}</div>}
    </div>
  );
}
