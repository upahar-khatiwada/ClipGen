import { Wand2 } from "lucide-react";

const GeneratingShortDialog = () => {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center animate-pulse">
            <Wand2 className="text-indigo-600" size={28} />
          </div>

          <h2 className="text-xl font-bold text-slate-800">
            Generating your short…
          </h2>

          <p className="text-slate-500 text-sm">
            This may take 30–90 seconds. We’re creating captions, visuals, and
            music.
          </p>

          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden relative">
            <div className="absolute h-full w-1/3 bg-indigo-500 animate-progress" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratingShortDialog;
