import { Wand2, X } from "lucide-react";

interface GeneratingShortDialogProps {
  status: "processing" | "completed" | "failed";
  videoUrl?: string;
  onClose: () => void;
}

const GeneratingShortDialog = ({
  status,
  videoUrl,
  onClose,
}: GeneratingShortDialogProps) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in relative">
        {status === "completed" && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X size={18} />
          </button>
        )}

        {status === "processing" && (
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
        )}

        {status === "completed" && videoUrl && (
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-slate-800 text-center">
              Your Generated Short 🎉
            </h2>

            <video
              src={videoUrl}
              controls
              autoPlay
              loop
              playsInline
              className="w-full rounded-xl shadow-lg"
            />
          </div>
        )}

        {status === "failed" && (
          <div className="text-center">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={18} />
            </button>
            <h2 className="text-xl font-bold text-red-600">
              Generation Failed
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              Something went wrong. Please try again.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneratingShortDialog;
