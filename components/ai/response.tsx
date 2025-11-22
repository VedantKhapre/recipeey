import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

export type ResponseProps = HTMLAttributes<HTMLDivElement>;

export const Response = ({ className, ...props }: ResponseProps) => (
  <div
    className={cn(
      'rounded-lg border bg-muted/50 p-4 text-sm',
      className
    )}
    {...props}
  />
);
