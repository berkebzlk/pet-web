import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { useEffect, useState } from "react";
import type { Post } from "../types/post.types";
import { CommentInput } from "./CommentInput";
import { CommentList } from "./CommentList";

interface PostCommentsDrawerProps {
    post: Post | null;
    open: boolean;
    onClose: () => void;
}

export function PostCommentsDrawer({ post, open, onClose }: PostCommentsDrawerProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [startY, setStartY] = useState(0);
    const [currentY, setCurrentY] = useState(0);

    useEffect(() => {
        if (open) {
            setIsVisible(true);
            document.body.style.overflow = 'hidden';
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300); // Wait for animation
            document.body.style.overflow = '';
            return () => clearTimeout(timer);
        }
    }, [open]);

    const handleTouchStart = (e: React.TouchEvent) => {
        setStartY(e.touches[0].clientY);
        setIsDragging(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;
        const y = e.touches[0].clientY;
        const diff = y - startY;
        if (diff > 0) {
            setCurrentY(diff);
        }
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        if (currentY > 100) {
            onClose();
        }
        setCurrentY(0);
    };

    if (!isVisible && !open) return null;

    if (!post) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-end justify-center sm:hidden">
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={`relative w-full bg-background rounded-t-xl shadow-xl transition-transform duration-300 ease-out flex flex-col h-[85vh]`}
                style={{
                    transform: open ? `translateY(${currentY}px)` : 'translateY(100%)',
                }}
            >
                {/* Handle bar for dragging */}
                <div
                    className="w-full flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing touch-none"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <div className="w-12 h-1.5 bg-muted rounded-full" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-center py-2 border-b relative">
                    <span className="font-semibold text-sm">Comments</span>
                </div>

                {/* Content */}
                <ScrollArea className="flex-1 p-4">
                    <CommentList post={post} />
                </ScrollArea>

                {/* Footer (Input) */}
                <div className="p-4 border-t pb-8"> {/* Extra padding for safe area */}
                    <CommentInput postId={post.id} />
                </div>
            </div>
        </div>
    );
}
