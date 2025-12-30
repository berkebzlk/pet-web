import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePetPosts } from '../hooks/usePosts';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { ArrowLeft, Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { enUS, tr } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import type { Post } from '../types/post.types';
import { useLikePost, useUnlikePost, useSavePost, useUnsavePost } from '../hooks/usePosts';

export function PostFeedPage() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { initialPostId, petId } = location.state || {};
    const { data: posts = [] } = usePetPosts(petId || 0);

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
            <div className="divide-y">
                {posts.map((post: Post) => (
                    <PostItem
                        key={post.id}
                        post={post}
                        ref={(el) => postRefs.current[post.id] = el}
                        i18n={i18n}
                    />
                ))}
            </div>
        </div>
    );
}

function PostItem({ post, i18n, ref }: { post: Post, i18n: any, ref: any }) {
    const likePost = useLikePost();
    const unlikePost = useUnlikePost();
    const savePost = useSavePost();
    const unsavePost = useUnsavePost();

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

    return (
        <div ref={ref} className="bg-card">
            {/* Header */}
            <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={post.pet?.image || undefined} />
                        <AvatarFallback>{post.pet?.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="font-semibold text-sm">{post.pet?.username}</span>
                </div>
                <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-5 w-5" />
                </Button>
            </div>

            {/* Image */}
            <div className="aspect-square bg-black flex items-center justify-center overflow-hidden">
                <img
                    src={post.image_url}
                    alt="Post"
                    className="w-full h-full object-contain"
                />
            </div>

            {/* Actions */}
            <div className="p-3">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`p-0 h-auto ${post.is_liked ? "text-red-500" : ""}`}
                            onClick={handleLike}
                        >
                            <Heart className={`h-6 w-6 ${post.is_liked ? "fill-current" : ""}`} />
                        </Button>
                        <Button variant="ghost" size="icon" className="p-0 h-auto">
                            <MessageCircle className="h-6 w-6" />
                        </Button>
                        <Button variant="ghost" size="icon" className="p-0 h-auto">
                            <Send className="h-6 w-6" />
                        </Button>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={`p-0 h-auto ${post.is_saved ? "text-primary" : ""}`}
                        onClick={handleSave}
                    >
                        <Bookmark className={`h-6 w-6 ${post.is_saved ? "fill-current" : ""}`} />
                    </Button>
                </div>

                <div className="font-semibold text-sm mb-2">{post.likes_count} likes</div>

                {post.description && (
                    <div className="mb-2">
                        <span className="font-semibold text-sm mr-2">{post.pet?.username}</span>
                        <span className="text-sm">{post.description}</span>
                    </div>
                )}

                <p className="text-xs text-muted-foreground uppercase">
                    {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: i18n.language === 'tr' ? tr : enUS })}
                </p>
            </div>
        </div>
    );
}
