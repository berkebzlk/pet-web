import { useFeed } from "../hooks/usePosts";
import { PostCard } from "../components/PostCard";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import type { Post } from "../types/post.types";
import { useMediaQuery } from "@/shared/hooks/useMediaQuery";
import { PostCommentsDrawer } from "../components/PostCommentsDrawer";
import { PostDetailModal } from "../components/PostDetailModal";

export default function FeedPage() {
    const { data: posts, isLoading } = useFeed();
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container max-w-lg mx-auto py-4 pb-20">
            {posts?.map((post) => (
                <PostCard
                    key={post.id}
                    post={post}
                    onCommentClick={() => setSelectedPost(post)}
                />
            ))}
            {posts?.length === 0 && (
                <div className="text-center text-muted-foreground py-10">
                    No posts yet. Be the first to share!
                </div>
            )}

            {/* Mobile Drawer */}
            {!isDesktop && (
                <PostCommentsDrawer
                    post={selectedPost}
                    open={!!selectedPost}
                    onClose={() => setSelectedPost(null)}
                />
            )}

            {/* Desktop Modal */}
            {isDesktop && (
                <PostDetailModal
                    post={selectedPost}
                    open={!!selectedPost}
                    onOpenChange={(open) => !open && setSelectedPost(null)}
                />
            )}
        </div>
    );
}
