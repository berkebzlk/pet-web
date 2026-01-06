import type { Post } from "../types/post.types";
import { Avatar, AvatarFallback, AvatarImage } from "../../../shared/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "../../../shared/components/ui/card";
import { Heart, MessageCircle, Send, Bookmark } from "lucide-react";
import { Button } from "../../../shared/components/ui/button";
import { useLikePost, useUnlikePost, useSavePost, useUnsavePost } from "../hooks/usePosts";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { useActivePet } from "../../../shared/hooks/useActivePet";
import { toast } from "sonner";

interface PostCardProps {
    post: Post;
    onCommentClick?: () => void;
    onPostUpdate?: (post: Post) => void;
}

export function PostCard({ post, onCommentClick, onPostUpdate }: PostCardProps) {
    const likePost = useLikePost({
        onSuccess: () => {
            if (onPostUpdate) {
                onPostUpdate({
                    ...post,
                    is_liked: true,
                    likes_count: post.likes_count + 1
                });
            }
        }
    });
    const unlikePost = useUnlikePost({
        onSuccess: () => {
            if (onPostUpdate) {
                onPostUpdate({
                    ...post,
                    is_liked: false,
                    likes_count: Math.max(0, post.likes_count - 1)
                });
            }
        }
    });
    const savePost = useSavePost();
    const unsavePost = useUnsavePost();

    const { activePetId } = useActivePet();

    const handleLike = () => {
        if (!activePetId) {
            toast.error("Please select a pet first");
            return;
        }
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
        if (post.is_saved) {
            unsavePost.mutate({ id: post.id, petId: activePetId });
        } else {
            savePost.mutate({ id: post.id, petId: activePetId });
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto mb-4 border-none shadow-sm">
            <CardHeader className="flex flex-row items-center gap-3 p-4">
                <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarImage src={post.pet?.image || undefined} alt={post.pet?.name} />
                    <AvatarFallback>{post.pet?.name?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="font-semibold text-sm cursor-pointer hover:underline">
                        {post.pet?.username || post.pet?.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {post.created_at && !isNaN(new Date(post.created_at).getTime())
                            ? formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: tr })
                            : ''}
                    </span>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="relative aspect-square w-full bg-muted">
                    <img
                        src={post.image_url}
                        alt="Post"
                        className="object-cover w-full h-full"
                        loading="lazy"
                    />
                </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start p-4 gap-3">
                <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`gap-2 px-2 ${post.is_liked ? "text-red-500 hover:text-red-600" : "hover:text-red-500"}`}
                            onClick={handleLike}
                        >
                            <Heart className={`h-6 w-6 ${post.is_liked ? "fill-current" : ""}`} />
                            {post.likes_count > 0 && <span className="text-sm font-semibold">{post.likes_count}</span>}
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2 px-2"
                            onClick={onCommentClick}
                        >
                            <MessageCircle className="h-6 w-6" />
                            {post.comments_count > 0 && <span className="text-sm font-semibold">{post.comments_count}</span>}
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
                {post.description && (
                    <div className="text-sm">
                        <span className="font-semibold mr-2">{post.pet?.username || post.pet?.name}</span>
                        {post.description}
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}
