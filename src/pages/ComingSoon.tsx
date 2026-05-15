import { Construction } from "lucide-react";

export default function ComingSoon({ title = "Halaman ini" }: { title?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-6">
        <Construction size={32} className="text-slate-400" />
      </div>
      <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
      <p className="text-slate-400 max-w-md">Fitur ini sedang dalam pengembangan dan akan segera tersedia.</p>
    </div>
  );
}
