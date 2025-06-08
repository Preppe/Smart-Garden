import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BackButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

export const BackButton = ({ onClick, children, className }: BackButtonProps) => {
  return (
    <Button variant="ghost" onClick={onClick} className={cn('text-emerald-600 hover:text-emerald-700', className)}>
      <ArrowLeft className="mr-2 h-4 w-4" />
      {children}
    </Button>
  );
};
