import { useFeed } from '@/modules/post/hooks/usePosts';
import { PostCard } from '@/modules/post/components/PostCard';
import { Loader2 } from 'lucide-react';

export function HomePage() {
    const { data: posts, isLoading } = useFeed();

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
                <PostCard key={post.id} post={post} />
            ))}
            {posts?.length === 0 && (
                <div className="text-center text-muted-foreground py-10">
                    No posts yet. Be the first to share!
                </div>
            )}
        </div>
    );
}
