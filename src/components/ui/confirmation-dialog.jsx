import React from "react";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, XCircle, Info } from "lucide-react";

const ConfirmationDialog = ({
   open,
   onOpenChange,
   title,
   description,
   confirmText = "Confirm",
   cancelText = "Cancel",
   onConfirm,
   onCancel,
   variant = "default", // "default", "destructive", "success", "warning"
   loading = false,
}) => {
   const getIcon = () => {
      switch (variant) {
         case "destructive":
            return <XCircle className='h-6 w-6 text-destructive' />;
         case "success":
            return <CheckCircle className='h-6 w-6 text-green-600' />;
         case "warning":
            return <AlertTriangle className='h-6 w-6 text-yellow-600' />;
         default:
            return <Info className='h-6 w-6 text-blue-600' />;
      }
   };

   const handleConfirm = () => {
      if (onConfirm) {
         onConfirm();
      }
   };

   const handleCancel = () => {
      if (onCancel) {
         onCancel();
      } else {
         onOpenChange(false);
      }
   };

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent className='sm:max-w-[425px]'>
            <DialogHeader>
               <div className='flex items-center gap-3'>
                  {getIcon()}
                  <DialogTitle className='text-lg'>{title}</DialogTitle>
               </div>
               {description && (
                  <DialogDescription className='text-sm text-muted-foreground'>
                     {description}
                  </DialogDescription>
               )}
            </DialogHeader>
            <DialogFooter className='flex gap-2'>
               <Button
                  variant='outline'
                  onClick={handleCancel}
                  disabled={loading}
               >
                  {cancelText}
               </Button>
               <Button
                  variant={
                     variant === "destructive" ? "destructive" : "default"
                  }
                  onClick={handleConfirm}
                  disabled={loading}
               >
                  {loading ? "Processing..." : confirmText}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
};

export default ConfirmationDialog;
