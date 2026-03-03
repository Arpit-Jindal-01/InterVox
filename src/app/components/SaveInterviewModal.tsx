import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

interface SaveInterviewModalProps {
  open: boolean;
  onSave: () => void;
  onSkip: () => void;
  score: number;
  role: string;
}

export default function SaveInterviewModal({
  open,
  onSave,
  onSkip,
  score,
  role,
}: SaveInterviewModalProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="bg-[#0A0A0A] border border-zinc-800 max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold text-white">
            Save Interview to History?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-400 text-base mt-4">
            <div className="space-y-3">
              <p>
                Would you like to save this <span className="text-white font-semibold">{role}</span> interview 
                to your history?
              </p>
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Your Score:</span>
                  <span className={`text-2xl font-bold ${
                    score >= 80 ? 'text-green-400' : 
                    score >= 60 ? 'text-yellow-400' : 
                    'text-red-400'
                  }`}>
                    {score}%
                  </span>
                </div>
              </div>
              <p className="text-sm text-zinc-500">
                Saved interviews can be reviewed later from your history page.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel 
            onClick={onSkip}
            className="bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white"
          >
            No, Don't Save
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onSave}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
          >
            Yes, Save Interview
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
