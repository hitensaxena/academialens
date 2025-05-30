import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { ClipboardPaste } from 'lucide-react';

export function PasteQuickTextButton() {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [text, setText] = React.useState('');
  const [successMsg, setSuccessMsg] = React.useState('');

  const handlePaste = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
      setText('');
      setSuccessMsg('Quick Text pasted to your research notes!');
      setTimeout(() => setSuccessMsg(''), 2000);
    }, 1200);
  };

  return (
    <>
      <Button
        className="w-full flex items-center justify-start gap-3 py-6 text-base transition-transform hover:scale-[1.02] focus:scale-[1.02]"
        variant="outline"
        aria-label="Paste Quick Text"
        onClick={() => setOpen(true)}
      >
        <ClipboardPaste className="h-6 w-6 text-primary" aria-hidden="true" />
        Paste Quick Text
      </Button>
      {successMsg && (
        <div className="mt-2 text-green-600 text-sm transition-opacity duration-500" role="status">
          {successMsg}
        </div>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Paste Quick Text</DialogTitle>
          </DialogHeader>
          <textarea
            className="w-full border rounded-md p-2 min-h-[80px] resize-y focus:outline-none focus:ring"
            placeholder="Paste or type your text here..."
            value={text}
            onChange={e => setText(e.target.value)}
            aria-label="Quick Text Input"
            autoFocus
          />
          <DialogFooter>
            <Button onClick={handlePaste} disabled={loading || !text.trim()} className="w-full">
              {loading ? 'Pasting...' : 'Paste'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default PasteQuickTextButton;
