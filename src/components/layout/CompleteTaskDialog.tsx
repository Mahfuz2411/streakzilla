import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface CompleteTaskDialogProps {
  open: boolean
  taskTitle: string
  onConfirm: () => void
  onCancel: () => void
}

export function CompleteTaskDialog({
  open,
  taskTitle,
  onConfirm,
  onCancel,
}: CompleteTaskDialogProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Mark Task Complete?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <div>
              Are you sure you want to mark <strong>{taskTitle}</strong> as done today?
            </div>
            <div className="text-destructive font-medium">
              ⚠️ This action cannot be undone. Your streak will be updated.
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex gap-3">
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-primary">
            Confirm
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
