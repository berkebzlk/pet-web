import { Dialog, DialogContent } from "@/shared/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Trash2, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useAuthUser } from "@/modules/auth/hooks/useAuth";
import { useLikePost, useUnlikePost, useSavePost, useUnsavePost, useDeletePost } from "../hooks/usePosts";
import { formatDistanceToNow } from "date-fns";
import { enUS, tr } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { CommentList } from "./CommentList";
import { CommentInput } from "./CommentInput";
import { useActivePet } from "../../../shared/hooks/useActivePet";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { postService } from "../services/post.service";

interface PostDetailModalProps {
    postId: number | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onNext?: () => void;
    onPrev?: () => void;
    hasNext?: boolean;
    hasPrev?: boolean;
    onPostUpdate?: (post: any) => void;
}

export function PostDetailModal({ postId, open, onOpenChange, onNext, onPrev, hasNext, hasPrev }: PostDetailModalProps) {
    const { i18n, t } = useTranslation();
    const { data: user } = useAuthUser();

    const { data: post, isLoading } = useQuery({
        queryKey: ['post', postId],
        queryFn: () => postId ? postService.getPost(postId) : null,
        enabled: !!postId && open,
    });

    const likePost = useLikePost();
    const unlikePost = useUnlikePost();
    const savePost = useSavePost();
    const unsavePost = useUnsavePost();
    const deletePost = useDeletePost();
    const { activePetId } = useActivePet();

    if (!postId && !open) return null;

    const handleLike = () => {
        if (!activePetId) {
            toast.error("Please select a pet first");
            return;
        }
        if (!post) return;

        if (post.is_liked) {
            unlikePost.mutate({ id: post.id, petId: activePetId });
        } else {
            likePost.mutate({ id: post.id, petId: activePetId });
        }
    };

    const handleSave = () => {
        if (!activePetId) {
            toast.error("Please select a pet first");
            return;
        }
        if (!post) return;

        if (post.is_saved) {
            unsavePost.mutate({ id: post.id, petId: activePetId });
        } else {
            savePost.mutate({ id: post.id, petId: activePetId });
        }
    };

    const handleDeletePost = () => {
        if (!post) return;
        if (confirm(t('post.deleteConfirm'))) {
            deletePost.mutate(post.id, {
                onSuccess: () => onOpenChange(false)
            });
        }
    };

    const isOwner = post && user?.pets?.some(pet => pet.id === post.pet_id);

    const handleCommentAdded = () => {
        if (post && onPostUpdate) {
            onPostUpdate({
                ...post,
                comments_count: post.comments_count + 1
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[900px] p-0 gap-0 md:flex h-[80vh] md:h-[600px] border-none bg-transparent shadow-none outline-none">

                {isLoading || !post ? (
                    <div className="w-full h-full bg-background flex items-center justify-center rounded-lg">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <>
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
                                            <AvatarFallback>{post.pet?.name?.[0] || post.pet?.username?.[0] || '?'}</AvatarFallback>
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

                                    <CommentList post={post} />
                                </ScrollArea>

                                {/* Actions */}
                                <div className="p-4 border-t mt-auto">
                                    {!(post.pet?.isClinic || !!post.veterinary_profile_id) && (
                                        <>
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
                                            <div className="font-semibold text-sm mb-2">{post.likes_count} {t('post.likes')}</div>
                                        </>
                                    )}
                                    <p className="text-xs text-muted-foreground uppercase mb-4">
                                        {post.created_at && !isNaN(new Date(post.created_at).getTime())
                                            ? formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: i18n.language === 'tr' ? tr : enUS })
                                            : ''}
                                    </p>

                                    {/* Comment Input */}
                                    {!(post.pet?.isClinic || !!post.veterinary_profile_id) && (
                                        <CommentInput postId={post.id} onCommentAdded={handleCommentAdded} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
