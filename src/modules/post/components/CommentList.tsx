import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { enUS, tr } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import type { Post } from "../types/post.types";
import { usePostComments } from "../hooks/usePosts";
import { Loader2 } from "lucide-react";

interface CommentListProps {
    post: Post;
}

export function CommentList({ post }: CommentListProps) {
    const { i18n } = useTranslation();
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading
    } = usePostComments(post.id);

    const comments = data?.pages.flatMap(page => page.data) || [];

    return (
        <div className="space-y-4">
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

            {/* Comments */}
            {isLoading ? (
                <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
            ) : comments.length > 0 ? (
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                            <Avatar className="h-8 w-8 shrink-0">
                                <AvatarImage src={comment.pet?.image || undefined} />
                                <AvatarFallback>{comment.pet?.name?.[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                                <div className="text-sm">
                                    <span className="font-semibold mr-2">{comment.pet?.username || comment.pet?.name}</span>
                                    {comment.content}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: i18n.language === 'tr' ? tr : enUS })}
                                </p>
                            </div>
                        </div>
                    ))}

                    {hasNextPage && (
                        <div className="flex justify-center pt-2">
                            <button
                                onClick={() => fetchNextPage()}
                                disabled={isFetchingNextPage}
                                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {isFetchingNextPage ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    "Load more comments"
                                )}
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center text-muted-foreground text-sm py-8">
                    No comments yet.
                </div>
            )}
        </div>
    );
}
