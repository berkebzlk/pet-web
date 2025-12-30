import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePetPosts } from '../hooks/usePosts';
import { Button } from '@/shared/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Post } from '../types/post.types';
import { PostCard } from '../components/PostCard';
import { useMediaQuery } from '@/shared/hooks/useMediaQuery';
import { PostCommentsDrawer } from '../components/PostCommentsDrawer';
import { PostDetailModal } from '../components/PostDetailModal';

export function PostFeedPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { initialPostId, petId } = location.state || {};
    const { data: posts = [] } = usePetPosts(petId || 0);

    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const postRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

    // Scroll to initial post on mount
    useEffect(() => {
        if (initialPostId && posts.length > 0 && postRefs.current[initialPostId]) {
            postRefs.current[initialPostId]?.scrollIntoView({ behavior: 'auto', block: 'center' });
        }
    }, [initialPostId, posts]);

    if (!petId) {
        return <div className="p-4">Invalid access</div>;
    }

    return (
        <div className="bg-background min-h-screen pb-20">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b px-4 h-14 flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-6 w-6" />
                </Button>
                <h1 className="font-semibold text-lg">Gönderiler</h1>
            </header>

            {/* Feed */}
            <div className="divide-y container max-w-lg mx-auto">
                {posts.map((post: Post) => (
                    <div key={post.id} ref={(el) => { postRefs.current[post.id] = el; }}>
                        <PostCard
                            post={post}
                            onCommentClick={() => setSelectedPost(post)}
                        />
                    </div>
                ))}
            </div>

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
