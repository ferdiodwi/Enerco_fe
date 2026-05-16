import { Construction } from "lucide-react";

export default function ComingSoon({ title = "Halaman ini" }: { title?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="rounded-2xl border border-gray-200 bg-white w-full max-w-md p-8 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-6 dark:bg-gray-800">
            <Construction size={32} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2 dark:text-white">{title}</h2>
          <p className="text-gray-500 dark:text-gray-400">Fitur ini sedang dalam pengembangan dan akan segera tersedia.</p>
        </div>
      </div>
    </div>
  );
}
