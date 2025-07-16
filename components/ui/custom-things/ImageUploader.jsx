"use client"

import { AlertCircleIcon, ImageIcon, UploadIcon, XIcon } from "lucide-react"
import { useEdgeStore } from '@/lib/edgestore';
import { useFileUpload } from "@/hooks/use-file-upload"
import { Button } from "@/components/ui/button"


import React, { useEffect, useState, useRef } from "react"
import ProgressDialog from "./progress-dialog/progress-dialog"

export default function ImageUploader() {


  const maxSizeMB = 2
  const maxSize = maxSizeMB * 1024 * 1024 // 2MB default

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({
    accept: "image/svg+xml,image/png,image/jpeg,image/jpg,image/gif",
    maxSize,
  })
  const previewUrl = files[0]?.preview || null
  const fileName = files[0]?.file.name || null

  // EDGE STORE:: 
   const { edgestore } = useEdgeStore();

  useEffect(() => setSubmitError(""), [files]) // Remove submit error if image changed!

  const [submitError, setSubmitError] = useState("");
  const [progress, setProgress] = useState(0);
  const [progressOpen, setProgressOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [abortController, setAbortController] = useState();

  const file = files[0]?.file || null;
  const UploadImage = async (e) => {
    e.preventDefault();

    if (!file) { // if no file!
      setSubmitError("Please select an image before uploading.");
      return;
    }

    setSubmitError(""); // REMOVE ERROR
    setProgress(0);
    setProgressOpen(true);
    setIsProcessing(true);

    // Upload Logic with AbortController
    const abortController = new AbortController();
    setAbortController(abortController);
    try {
      const res = await edgestore.publicFiles.upload({
        file,
        signal: abortController.signal,
        onProgressChange: (progress) => {
          setProgress(progress);
        },
      });
      setIsProcessing(false);
      setProgress(100);
      // Optionally, you can close the dialog after a delay or show a success message
      console.log(res.url);
    } catch (err) {
      if (abortController.signal.aborted) {
        console.log("Canceled Success");
      } else {
        setSubmitError("Upload failed. Please try again.");
      }
      setIsProcessing(false);
      setProgressOpen(false);
    }
  }

  return (
    <>
      <form onSubmit={UploadImage} className="flex flex-1 flex-col items-center justify-center min-h-screen">
        <div className="flex flex-col gap-2 w-full max-w-md">
          <div className="relative">
            {/* Drop area */}
            <div
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              data-dragging={isDragging || undefined}
              className="border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors has-[input:focus]:ring-[3px]">
              <input {...getInputProps()} className="sr-only" aria-label="Upload image file" />
              {previewUrl ? (
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <img
                    src={previewUrl}
                    alt={files[0]?.file?.name || "Uploaded image"}
                    className="mx-auto max-h-full rounded object-contain" />
                </div>
              ) : (
                <div
                  className="flex flex-col items-center justify-center px-4 py-3 text-center">
                  <div
                    className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
                    aria-hidden="true">
                    <ImageIcon className="size-4 opacity-60" />
                  </div>
                  <p className="mb-1.5 text-sm font-medium">Drop your image here</p>
                  <p className="text-muted-foreground text-xs">
                    SVG, PNG, JPG or GIF (max. {maxSizeMB}MB)
                  </p>
                  <Button variant="outline" className="mt-4" type="button" onClick={openFileDialog}>
                    <UploadIcon className="-ms-1 size-4 opacity-60" aria-hidden="true" />
                    Select image
                  </Button>
                </div>
              )}
            </div>

            {previewUrl && (
              <div className="absolute top-4 right-4">
                <button
                  type="button"
                  className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
                  onClick={() => removeFile(files[0]?.id)}
                  aria-label="Remove image">
                  <XIcon className="size-4" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
          {errors.length > 0 && (
            <div className="text-destructive flex items-center gap-1 text-xs" role="alert">
              <AlertCircleIcon className="size-3 shrink-0" />
              <span>{errors[0]}</span>
            </div>
          )}
          {submitError && (
            <div className="text-destructive flex items-center gap-1 text-xs justify-center mx-auto" role="alert">
              <AlertCircleIcon className="size-3 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}
          <Button type="submit" className="w-full max-w-[180px] mt-2 mx-auto flex justify-center">
            <UploadIcon className="-ms-1 size-4 opacity-60 mr-2" aria-hidden="true" />
            Upload
          </Button>
        </div>
      </form>
      <ProgressDialog
        progress={progress}
        isOpen={progressOpen}
        setIsOpen={setProgressOpen}
        isProcessing={isProcessing}
        onCancel={() => {
          abortController?.abort();
          setIsProcessing(false);
          setProgressOpen(false);
          console.log("Canceled Success");
        }}
      />
    </>
  );
}
