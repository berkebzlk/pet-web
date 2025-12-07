import { cn } from '@/shared/lib/utils';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
    containerClassName?: string;
}

export function Section({ className, containerClassName, children, ...props }: SectionProps) {
    return (
        <section
            className={cn('py-12 md:py-16 lg:py-24', className)}
            {...props}
        >
            <div className={cn('container mx-auto px-4 md:px-6', containerClassName)}>
                {children}
            </div>
        </section>
    );
}
