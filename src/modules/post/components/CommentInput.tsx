import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useState } from "react";
import { useCommentPost } from "../hooks/usePosts";
import { useActivePet } from "@/shared/hooks/useActivePet";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { useAuthUser } from "@/modules/auth/hooks/useAuth";
import { ArrowUp } from "lucide-react";

interface CommentInputProps {
    postId: number;
    onCommentAdded?: () => void;
    className?: string;
}

export function CommentInput({ postId, onCommentAdded, className }: CommentInputProps) {
    const [comment, setComment] = useState("");
    const { activePetId } = useActivePet();
    const commentPost = useCommentPost();
    const { data: user } = useAuthUser();

    // Find active pet to show avatar
    const activePet = user?.pets?.find(p => p.id === activePetId);

    const handleComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim() || !activePetId) return;

        commentPost.mutate({ id: postId, content: comment, petId: activePetId }, {
            onSuccess: () => {
                setComment("");
                onCommentAdded?.();
            }
        });
    };

    return (
        <form onSubmit={handleComment} className={`flex items-center gap-3 relative ${className}`}>
            {activePet && (
                <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={activePet.image || undefined} />
                    <AvatarFallback>{activePet.name[0]}</AvatarFallback>
                </Avatar>
            )}
            <div className="flex-1 relative">
                <Input
                    placeholder="Add a comment..."
                    className="w-full pr-10 border-none focus-visible:ring-0 px-0 bg-transparent shadow-none"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    className={`absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8 transition-all duration-200 ${comment.trim()
                            ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground rounded-full"
                            : "text-muted-foreground/30 hover:bg-transparent cursor-not-allowed"
                        }`}
                    disabled={!comment.trim() || commentPost.isPending}
                >
                    <ArrowUp className="h-5 w-5" />
                </Button>
            </div>
        </form>
    );
}
