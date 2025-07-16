"use client"

import { useState, useRef } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { CheckIcon, CopyIcon } from "lucide-react"

export default function CodeAlert({
  isOpen,
  onOpenChange,
  code = "",
  copyLabel = "Copy Code",
  onOk,
}) {
  const [copied, setCopied] = useState(false);
  const [copyDisabled, setCopyDisabled] = useState(false);
  const textAreaRef = useRef(null);

  const handleOk = () => {
    if (onOk) onOk();
    onOpenChange(false);
  };



  const handleCopy = async () => {
    if (!code) return;
    let success = false;
    // Try modern clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(code);
        success = true;
      } catch {}
    }
    // Fallback: use a visible, off-screen textarea and select/focus it
    if (!success && textAreaRef.current) {
      textAreaRef.current.value = code;
      textAreaRef.current.style.position = 'fixed';
      textAreaRef.current.style.top = '0';
      textAreaRef.current.style.left = '0';
      textAreaRef.current.style.width = '1px';
      textAreaRef.current.style.height = '1px';
      textAreaRef.current.style.opacity = '0.01';
      textAreaRef.current.readOnly = false;
      textAreaRef.current.focus();
      textAreaRef.current.select();
      try {
        success = document.execCommand('copy');
      } catch {}
      textAreaRef.current.readOnly = true;
    }
    if (success) {
      setCopied(true);
      setCopyDisabled(true);
      setTimeout(() => {
        setCopied(false);
        setCopyDisabled(false);
      }, 2000);
    }
  };


  // CHANGE TITLE AND DESCRIPTION FROM PROPS

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md max-h-[80vh] flex flex-col">
        <AlertDialogHeader>
          <AlertDialogTitle>Image Code Generated!</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="flex flex-col items-center gap-2 mt-2">
              <span
                className="text-2xl font-mono font-bold tracking-widest bg-muted px-4 py-2 rounded-lg border select-all cursor-pointer hover:bg-accent transition text-center"
                title="Click to copy"
                onClick={handleCopy}
                style={{ userSelect: 'all' }}
              >
                {code}
              </span>
              <span className="text-base font-medium text-center text-muted-foreground">
                Use this code to share images accross your devices
                <br />
                <span className="text-black dark:text-amber-50 animate-pulse">This code is only valid for 10 minutes!</span>
              </span>
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex-col sm:flex-row gap-2 mt-6">
          <button
            type="button"
            onClick={handleCopy}
            disabled={copyDisabled || copied}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none bg-accent text-accent-foreground hover:bg-accent/80 ${copyDisabled || copied ? 'cursor-not-allowed' : ''}`}
            aria-label="Copy code"
          >
            {copied ? <CheckIcon className="size-4 text-green-600" /> : <CopyIcon className="size-4" />}
            {copied ? "Copied!" : copyLabel}
          </button>
          {/* Off-screen textarea for mobile fallback, always in DOM */}
          <textarea
            ref={textAreaRef}
            value={code || ''}
            tabIndex={-1}
            aria-hidden="true"
            style={{ position: 'fixed', top: 0, left: 0, width: 1, height: 1, opacity: 0.01, zIndex: -1 }}
            readOnly
            onChange={() => { }}
          />
          <AlertDialogAction onClick={handleOk} className="w-full sm:w-auto">
            OK
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
