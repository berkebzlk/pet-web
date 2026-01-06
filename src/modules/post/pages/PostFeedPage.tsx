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
import { postService } from '../services/post.service';
import { useActivePet } from '@/shared/hooks/useActivePet';

export function PostFeedPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { initialPostId, petId, posts: statePosts } = location.state || {};

    const [hydratedPosts, setHydratedPosts] = useState<Post[]>(statePosts || []);
    const { activePetId } = useActivePet();

    // If we have statePosts (from Discover), use them. Otherwise fetch using petId.
    const { data: fetchedData } = usePetPosts(petId || 0, { enabled: !!petId && !statePosts });
    const fetchedPosts = fetchedData || [];

    // Track if we have already hydrated to prevent loops
    const hydrationAttempted = useRef(false);

    // Effect to hydrate posts if they are minimal (from Discover)
    useEffect(() => {
        // Only run if we have state posts and haven't tried hydrating yet
        if (statePosts?.length > 0 && !hydrationAttempted.current) {
            // Check if posts are minimal (missing pet object is a good indicator)
            // We check statePosts here because that's our source of truth for "what needs hydration"
            const needsHydration = statePosts.some((p: Post) => !p.pet);

            if (needsHydration) {
                hydrationAttempted.current = true; // Mark as attempted

                const ids = statePosts.map((p: Post) => p.id);

                // Optimization: Slice to 20 around the initialPostId
                const initialIndex = statePosts.findIndex((p: Post) => p.id === initialPostId);
                const start = Math.max(0, initialIndex - 10);
                const end = Math.min(statePosts.length, initialIndex + 10);
                const targetIds = ids.slice(start, end);

                postService.getBatch(targetIds, activePetId).then(fullPosts => {
                    // Merge full posts into hydratedPosts
                    setHydratedPosts(prev => {
                        const newPosts = [...prev];
                        fullPosts.forEach(fullPost => {
                            const index = newPosts.findIndex(p => p.id === fullPost.id);
                            if (index !== -1) {
                                newPosts[index] = fullPost;
                            }
                        });
                        return newPosts;
                    });
                });
            } else {
                setHydratedPosts(statePosts);
            }
        } else if (fetchedPosts.length > 0 && hydratedPosts.length === 0) {
            // Only set if we haven't set them yet (to avoid loop if fetchedPosts changes reference)
            // Actually fetchedPosts from react-query is stable-ish but let's be safe
            setHydratedPosts(fetchedPosts);
        }
    }, [statePosts, fetchedData, activePetId, initialPostId]); // Use fetchedData (undefined or array) instead of fetchedPosts (new array)

    const posts = hydratedPosts;

    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const postRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
    const hasScrolled = useRef(false);

    // Scroll to initial post on mount
    useEffect(() => {
        if (initialPostId && posts.length > 0 && postRefs.current[initialPostId] && !hasScrolled.current) {
            postRefs.current[initialPostId]?.scrollIntoView({ behavior: 'auto', block: 'center' });
            hasScrolled.current = true;
        }
    }, [initialPostId, posts]);

    if (!posts.length && !petId) {
        return <div className="p-4">Invalid access</div>;
    }

    const handlePostUpdate = (updatedPost: Post) => {
        setHydratedPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
    };

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
                            onPostUpdate={handlePostUpdate}
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
                    onPostUpdate={handlePostUpdate}
                />
            )}

            {/* Desktop Modal */}
            {isDesktop && (
                <PostDetailModal
                    postId={selectedPost?.id || null}
                    open={!!selectedPost}
                    onOpenChange={(open) => !open && setSelectedPost(null)}
                    onPostUpdate={handlePostUpdate}
                />
            )}
        </div>
    );
}
