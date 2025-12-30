import { Dialog, DialogContent } from "@/shared/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useAuthUser } from "@/modules/auth/hooks/useAuth";
import { useLikePost, useUnlikePost, useCommentPost, useSavePost, useUnsavePost, useDeletePost, useDeleteComment } from "../hooks/usePosts";
import type { Post } from "../types/post.types";
import { formatDistanceToNow } from "date-fns";
import { enUS, tr } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { Input } from "@/shared/components/ui/input";

interface PostDetailModalProps {
    post: Post | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onNext?: () => void;
    onPrev?: () => void;
    hasNext?: boolean;
    hasPrev?: boolean;
}

export function PostDetailModal({ post, open, onOpenChange, onNext, onPrev, hasNext, hasPrev }: PostDetailModalProps) {
    const { i18n } = useTranslation();
    const [comment, setComment] = useState("");
    const { data: user } = useAuthUser();

    const likePost = useLikePost();
    const unlikePost = useUnlikePost();
    const commentPost = useCommentPost();
    const deleteComment = useDeleteComment();
    const savePost = useSavePost();
    const unsavePost = useUnsavePost();
    const deletePost = useDeletePost();

    if (!post) return null;

    const handleLike = () => {
        if (post.is_liked) {
            unlikePost.mutate(post.id);
        } else {
            likePost.mutate(post.id);
        }
    };

    const handleSave = () => {
        if (post.is_saved) {
            unsavePost.mutate(post.id);
        } else {
            savePost.mutate(post.id);
        }
    };

    const handleComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) return;

        commentPost.mutate({ id: post.id, content: comment }, {
            onSuccess: () => setComment("")
        });
    };

    const handleDeleteComment = (commentId: number) => {
        deleteComment.mutate({ postId: post.id, commentId });
    };

    const handleDeletePost = () => {
        if (confirm("Are you sure you want to delete this post?")) {
            deletePost.mutate(post.id, {
                onSuccess: () => onOpenChange(false)
            });
        }
    };

    const isOwner = user?.pets?.some(pet => pet.id === post.pet_id);

    // Navigation handlers
    const handleNext = () => {
        // Logic to be passed from parent or handled here if we have the list
        // For now, we rely on parent passing a handler or we need to inject the list here.
        // To make it simple, let's accept onNext and onPrev props.
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[900px] p-0 gap-0 md:flex h-[80vh] md:h-[600px] border-none bg-transparent shadow-none outline-none">

                {/* Desktop Navigation Buttons (Outside Content) */}
                <div className="hidden md:block absolute left-[-60px] top-1/2 -translate-y-1/2 z-50">
                    {hasPrev && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/20 rounded-full w-12 h-12"
                            onClick={onPrev}
                        >
                            <ChevronLeft className="w-8 h-8" />
                        </Button>
                    )}
                </div>
                <div className="hidden md:block absolute right-[-60px] top-1/2 -translate-y-1/2 z-50">
                    {hasNext && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/20 rounded-full w-12 h-12"
                            onClick={onNext}
                        >
                            <ChevronRight className="w-8 h-8" />
                        </Button>
                    )}
                </div>

                {/* Main Content Wrapper to restore white background and shadow */}
                <div className="flex w-full h-full bg-background rounded-lg overflow-hidden relative shadow-lg">
                    {/* Image Section */}
                    <div className="hidden md:flex items-center justify-center bg-black w-[500px]">
                        <img
                            src={post.image_url}
                            alt="Post"
                            className="max-h-full max-w-full object-contain"
                        />
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-col flex-1 h-full min-w-0">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={post.pet?.image || undefined} />
                                    <AvatarFallback>{post.pet?.name[0]}</AvatarFallback>
                                </Avatar>
                                <span className="font-semibold text-sm">{post.pet?.username}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {isOwner && (
                                    <Button variant="ghost" size="icon" onClick={handleDeletePost} className="text-destructive hover:text-destructive">
                                        <Trash2 className="h-5 w-5" />
                                    </Button>
                                )}
                                <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Comments Area */}
                        <ScrollArea className="flex-1 p-4">
                            {/* Mobile Image */}
                            <div className="md:hidden mb-4 rounded-md overflow-hidden bg-black flex items-center justify-center">
                                <img
                                    src={post.image_url}
                                    alt="Post"
                                    className="max-h-[400px] w-full object-contain"
                                />
                            </div>

                            {/* Caption */}
                            {post.description && (
                                <div className="flex gap-3 mb-6">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={post.pet?.image || undefined} />
                                        <AvatarFallback>{post.pet?.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm">
                                            <span className="font-semibold mr-2">{post.pet?.username}</span>
                                            {post.description}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: i18n.language === 'tr' ? tr : enUS })}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="text-center text-muted-foreground text-sm py-8">
                                No comments yet.
                            </div>
                        </ScrollArea>

                        {/* Actions */}
                        <div className="p-4 border-t mt-auto">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className={post.is_liked ? "text-red-500 hover:text-red-600" : ""}
                                        onClick={handleLike}
                                    >
                                        <Heart className={`h-6 w-6 ${post.is_liked ? "fill-current" : ""}`} />
                                    </Button>
                                    <Button variant="ghost" size="icon">
                                        <MessageCircle className="h-6 w-6" />
                                    </Button>
                                    <Button variant="ghost" size="icon">
                                        <Send className="h-6 w-6" />
                                    </Button>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={post.is_saved ? "text-primary" : ""}
                                    onClick={handleSave}
                                >
                                    <Bookmark className={`h-6 w-6 ${post.is_saved ? "fill-current" : ""}`} />
                                </Button>
                            </div>
                            <div className="font-semibold text-sm mb-2">{post.likes_count} likes</div>
                            <p className="text-xs text-muted-foreground uppercase mb-4">
                                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: i18n.language === 'tr' ? tr : enUS })}
                            </p>

                            {/* Comment Input */}
                            <form onSubmit={handleComment} className="flex items-center gap-2">
                                <Input
                                    placeholder="Add a comment..."
                                    className="flex-1 border-none focus-visible:ring-0 px-0"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                                <Button
                                    type="submit"
                                    variant="ghost"
                                    className="text-primary font-semibold hover:text-primary/80 px-2"
                                    disabled={!comment.trim() || commentPost.isPending}
                                >
                                    Post
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
