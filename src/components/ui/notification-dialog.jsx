import React from "react";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";

const NotificationDialog = ({
   open,
   onOpenChange,
   title,
   message,
   type = "info", // "success", "error", "warning", "info"
   autoClose = true,
   autoCloseDelay = 2000,
}) => {
   React.useEffect(() => {
      if (open && autoClose) {
         const timer = setTimeout(() => {
            onOpenChange(false);
         }, autoCloseDelay);

         return () => clearTimeout(timer);
      }
   }, [open, autoClose, autoCloseDelay, onOpenChange]);

   const getIcon = () => {
      switch (type) {
         case "success":
            return <CheckCircle className='h-8 w-8 text-green-600' />;
         case "error":
            return <XCircle className='h-8 w-8 text-destructive' />;
         case "warning":
            return <AlertTriangle className='h-8 w-8 text-yellow-600' />;
         default:
            return <Info className='h-8 w-8 text-blue-600' />;
      }
   };

   const getBackgroundColor = () => {
      switch (type) {
         case "success":
            return "bg-green-50 border-green-200";
         case "error":
            return "bg-red-50 border-red-200";
         case "warning":
            return "bg-yellow-50 border-yellow-200";
         default:
            return "bg-blue-50 border-blue-200";
      }
   };

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent className={`sm:max-w-[425px] ${getBackgroundColor()}`}>
            <DialogHeader>
               <div className='flex items-center gap-3 justify-center'>
                  {getIcon()}
                  <div className='text-center'>
                     <DialogTitle className='text-lg'>{title}</DialogTitle>
                     {message && (
                        <DialogDescription className='text-sm text-muted-foreground mt-2'>
                           {message}
                        </DialogDescription>
                     )}
                  </div>
               </div>
            </DialogHeader>
            {!autoClose && (
               <div className='flex justify-center mt-4'>
                  <Button onClick={() => onOpenChange(false)}>Close</Button>
               </div>
            )}
         </DialogContent>
      </Dialog>
   );
};

export default NotificationDialog;
