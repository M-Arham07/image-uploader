"use client"

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
import Image from "next/image"

export default function PictureAlert({
  isOpen,
  onOpenChange,
  imageSrc,
  title = "Alert",
  description = "This is an alert dialog with an image.",
  onOk,
  onClose,
}) {
  const handleOk = () => {
    if (onOk) onOk()
    onOpenChange(false)
  }

  const handleClose = () => {
    if (onClose) onClose()
    onOpenChange(false)
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md max-h-[80vh] flex flex-col">
        <AlertDialogHeader className="space-y-4">
          <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted">
            <Image
              src={imageSrc || "/placeholder.svg"}
              alt="Alert dialog image"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>
          <AlertDialogTitle className="text-center">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-center text-sm text-muted-foreground">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex-col sm:flex-row gap-2 mt-6">
          <AlertDialogCancel onClick={handleClose} className="w-full sm:w-auto">
            Close
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleOk} className="w-full sm:w-auto">
            OK
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
