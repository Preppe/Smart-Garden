import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
} from '@/components/ui/alert-dialog';

interface ActionButtonsProps {
  editAction: () => void;
  deleteAction: () => void;
  deleteConfirmation: {
    title: string;
    description: string;
  };
  isDeleting?: boolean;
  size?: 'sm' | 'default';
}

export const ActionButtons = ({
  editAction,
  deleteAction,
  deleteConfirmation,
  isDeleting = false,
  size = 'default',
}: ActionButtonsProps) => {
  return (
    <div className="flex space-x-3">
      <Button size={size} onClick={editAction}>
        <Edit className="mr-2 h-4 w-4" />
        Modifica
      </Button>
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant="outline" 
            size={size}
            className="text-red-600 hover:text-red-700 border-red-200"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Elimina
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{deleteConfirmation.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteConfirmation.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction 
              onClick={deleteAction} 
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Eliminazione...' : 'Elimina definitivamente'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
