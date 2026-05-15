import { Construction } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ComingSoon({ title = "Halaman ini" }: { title?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Card className="bg-slate-900/70 border-slate-800/60 w-full max-w-md p-8">
        <CardContent className="flex flex-col items-center p-0">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-6">
            <Construction size={32} className="text-slate-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
          <p className="text-slate-400">Fitur ini sedang dalam pengembangan dan akan segera tersedia.</p>
        </CardContent>
      </Card>
    </div>
  );
}
