import React from 'react'

// external imports
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


export default function ConfirmModal({ usage, clickEvent, isOpen, onClose, triggerElement }) {

  const logoutText = {
    title: 'Are you sure you want to logout?',
    description: 'Make sure to save your changes before logging out.',
    confirm: 'Logout'
  };
  const deleteText = {
    title: 'Are you absolutely sure?',
    description: 'This action cannot be undone. This will permanently delete the product from the database.',
    confirm: 'Continue'
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => onClose(open)}>
      <AlertDialogTrigger asChild>
        {triggerElement}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{usage === 'logout' ? logoutText.title : deleteText.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {usage === 'logout' ? logoutText.description : deleteText.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={clickEvent}>{usage === 'logout' ? logoutText.confirm : deleteText.confirm}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
