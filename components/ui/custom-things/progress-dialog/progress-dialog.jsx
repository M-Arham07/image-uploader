"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import CircularProgress from "./circular-progress"

export default function ProgressDialog({ progress, isOpen, setIsOpen, isProcessing, onCancel }) {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Uploading Image...</AlertDialogTitle>
          <AlertDialogDescription>
            {isProcessing
              ? "Please wait while we process your request..."
              : progress === 100
                ? "Image uploaded successfully!"
                : "Uploading will begin when you click Upload."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex justify-center py-6">
          <CircularProgress progress={progress} size={120} strokeWidth={8} colorClass="stroke-primary" />
        </div>

        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          {isProcessing && (
            <Button variant="outline" disabled className="w-full sm:w-auto bg-transparent">
              Processing...
            </Button>
          )}
          <AlertDialogCancel className="w-full sm:w-auto" onClick={onCancel}>
            {progress === 100 ? "Close" : "Cancel"}
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
