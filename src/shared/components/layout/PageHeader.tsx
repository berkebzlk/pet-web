import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface PageHeaderProps {
    title: string;
    showBack?: boolean;
    action?: ReactNode;
    className?: string;
}

export function PageHeader({ title, showBack, action, className }: PageHeaderProps) {
    const navigate = useNavigate();

    return (
        <div className={cn("flex items-center justify-between mb-6", className)}>
            <div className="flex items-center gap-4">
                {showBack && (
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="-ml-2">
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                )}
                <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            </div>
            {action && <div>{action}</div>}
        </div>
    );
}
