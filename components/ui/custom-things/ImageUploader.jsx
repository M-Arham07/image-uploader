"use client"

import { AlertCircleIcon, ImageIcon, UploadIcon, XIcon } from "lucide-react"
import { useEdgeStore } from '@/lib/edgestore';
import { useFileUpload } from "@/hooks/use-file-upload"
import { Button } from "@/components/ui/button"


import React, { useEffect, useState, useRef } from "react"
import ProgressDialog from "./progress-dialog/progress-dialog"
import PictureAlert from "./CodeAlert"
import GenerateCode from "@/server-utilities/GenerateCode";
import ConnectDB from "@/server-utilities/ConnectDB";
import SaveCode from "@/server-utilities/SaveCode";
import Link from "next/link";
import { Share1Icon } from "@radix-ui/react-icons";

export default function ImageUploader() {


  const maxSizeMB = 4
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
    multiple: true,
    maxFiles: 10
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
  const [dialogOpen, setDialogOpen] = useState(false);
  // Removed dialogImg state, not used anymore
  const [dialogCode, setDialogCode] = useState("");



  const UploadImage = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      setSubmitError("Please select at least one image.");
      return;
    }

    setSubmitError("");
    setProgress(0);
    setProgressOpen(true);
    setIsProcessing(true);

    const abortController = new AbortController();
    setAbortController(abortController);

    try {
      const fileArray = files.map(f => f.file);
      
      // Track progress for all files
      let completedFiles = 0;
      const totalFiles = fileArray.length;

      // Upload files in parallel using Promise.all
      const uploadPromises = fileArray.map((file, index) => 
        edgestore.publicFiles.upload({
          file,
          options: {
            temporary: true
          },
          onProgressChange: (progress) => {
            // Calculate combined progress for all files
            const combinedProgress = ((completedFiles + progress / 100) / totalFiles) * 100;
            setProgress(Math.floor(combinedProgress));
          },
        }).then(result => {
          completedFiles++;
          return result;
        })
      );

      const results = await Promise.all(uploadPromises);
      const uploads = results.map(res => res.url);
      setProgress(100);
      setIsProcessing(false);
      setProgressOpen(false);

      // Generate code and show dialog before database save
      const code = GenerateCode();
      setDialogCode(code);
      setDialogOpen(true);

      // After user sees the code, save to database
      await SaveCode(uploads, code);

      return true;




    } catch (err) {
      console.error(err);

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
      <form
        onSubmit={UploadImage}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="flex flex-1 flex-col items-center justify-center min-h-screen relative"
        data-dragging={isDragging || undefined}
      >
        <div className="absolute inset-0 pointer-events-none transition-colors data-[dragging=true]:bg-accent/10" />
        <div className="text-center mb-8">
          <h1 className="text-3xl mb-2 text-gray-900 dark:text-white font-extrabold">Image Shared</h1>
          <p className="text-gray-600 dark:text-gray-400 text-[0.9rem] sm:text-[1.2rem]">Share your images securely with a unique access code.</p>
        </div>
        <div className="flex flex-col gap-2 w-full max-w-md sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] mb-20 sm:mb-0">
          <div className="relative">
            {/* Drop area */}
            <div
              data-dragging={isDragging || undefined}
              className="border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors has-[input:focus]:ring-[3px] w-full">
              <input {...getInputProps()} className="sr-only" aria-label="Upload image file" />
              {files.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 w-full max-h-[40vh] sm:max-h-[50vh] overflow-y-auto custom-scrollbar">
                  {files.map((file, index) => (
                    <div key={file.id} className="relative group aspect-square">
                      <img
                        src={file.preview}
                        alt={file.file.name || `Image ${index + 1}`}
                        className="w-full h-full rounded object-cover"
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 opacity-100 focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-all outline-none hover:bg-black/80 focus-visible:ring-[3px]"
                        onClick={() => removeFile(file.id)}
                        aria-label="Remove image">
                        <XIcon className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className="flex flex-col items-center justify-center px-4 py-3 text-center">
                  <div
                    className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
                    aria-hidden="true">
                    <ImageIcon className="size-4 opacity-60" />
                  </div>
                  {/*=== HIDE Drop your image here on smaller screeens  ===*/}
                  <p className="mb-1.5 text-sm hidden font-medium lg:flex">Drop your images anywhere on this page</p>

                  {/* "Show Select your image" instead on mobile phones! */}
                  <p className="mb-1.5 text-sm lg:hidden font-medium">Select your images</p>




                  <p className="text-muted-foreground text-xs">
                    SVG, PNG, JPG or GIF (max. {maxSizeMB}MB)
                  </p>
                  <Button variant="outline" className="mt-4 cursor-pointer" type="button" onClick={openFileDialog}>
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
          <Button type="submit" className="w-full max-w-[180px] mt-2 mx-auto flex justify-center cursor-pointer">
            <Share1Icon className="-ms-1 size-4 opacity-60 mr-2" aria-hidden="true" />
            Share
          </Button>
          <div className="flex items-center justify-center w-full my-5 sm:mt-2 gap-2">
            <span className="flex-1 h-px bg-muted-foreground/20" />
            <span className="text-xs text-muted-foreground font-semibold px-2">OR</span>
            <span className="flex-1 h-px bg-muted-foreground/20" />
          </div>
          {/* Retrieve Button */}
          <Link href='/retrieve'><Button variant="secondary" type="button" className="w-full max-w-xs mt-1 sm:mt-[-12px] mx-auto flex justify-center cursor-pointer">Retrieve Image</Button></Link>
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
      <PictureAlert
        isOpen={dialogOpen}
        onOpenChange={setDialogOpen}
        code={dialogCode}
        copyLabel="Copy Code"
        onOk={() => setDialogOpen(false)}
        onClose={() => setDialogOpen(false)}
      />
    </>
  );
}
