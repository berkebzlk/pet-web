import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/components/ui/button';
import { ArrowLeft, UserPlus, Check, X, MessageCircle, Heart } from 'lucide-react';
import { usePetPosts } from '@/modules/post/hooks/usePosts';
import { PostDetailModal } from '@/modules/post/components/PostDetailModal';
import type { Post } from '@/modules/post/types/post.types';
import { petService } from '@/modules/pet/services/pet.service';
import { useActivePet } from '@/shared/hooks/useActivePet';
import { useCheckMatchStatus, useCreateMatch, useAcceptMatch, useRejectMatch, useCancelMatch } from '@/modules/match/hooks/useMatch';
import { toast } from 'sonner';
import type { Pet } from '@/modules/pet/types/pet.types';

import { MatchListModal } from '@/modules/match/components/MatchListModal';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";

export function PublicProfilePage() {
    const { username } = useParams<{ username: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { activePetId } = useActivePet();

    const [pet, setPet] = useState<Pet | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [isMatchListOpen, setIsMatchListOpen] = useState(false);
    const [isUnmatchDialogOpen, setIsUnmatchDialogOpen] = useState(false);

    // Fetch pet details
    useEffect(() => {
        const fetchPet = async () => {
            if (!username) return;
            try {
                setLoading(true);
                const data = await petService.getByUsername(username);
                setPet(data.data);
            } catch (error) {
                console.error("Failed to fetch pet:", error);
                toast.error(t('profile.userNotFound'));
                navigate(-1);
            } finally {
                setLoading(false);
            }
        };
        fetchPet();
    }, [username, navigate]);

    // Fetch posts
    const { data: posts = [] } = usePetPosts(pet?.id || 0, { enabled: !!pet?.id });

    // Match logic
    const { data: matchStatus, refetch: refetchMatchStatus } = useCheckMatchStatus(activePetId || undefined, pet?.id);
    const createMatch = useCreateMatch();
    const acceptMatch = useAcceptMatch();
    const rejectMatch = useRejectMatch();
    const cancelMatch = useCancelMatch();

    const handleMatch = () => {
        if (!activePetId || !pet) return;
        createMatch.mutate({
            initiator_pet_id: activePetId,
            target_pet_id: pet.id
        }, {
            onSuccess: () => {
                refetchMatchStatus();
            }
        });
    };

    const handleUnmatch = () => {
        if (!matchStatus) return;
        cancelMatch.mutate(matchStatus.id, {
            onSuccess: () => {
                setIsUnmatchDialogOpen(false);
                refetchMatchStatus();
            }
        });
    };

    const handlePostClick = (post: Post) => {
        if (window.innerWidth < 768) {
            navigate('/app/posts', { state: { initialPostId: post.id, petId: pet?.id } });
        } else {
            setSelectedPost(post);
        }
    };

    const handleNextPost = () => {
        if (!selectedPost) return;
        const currentIndex = posts.findIndex(p => p.id === selectedPost.id);
        if (currentIndex < posts.length - 1) {
            setSelectedPost(posts[currentIndex + 1]);
        }
    };

    const handlePrevPost = () => {
        if (!selectedPost) return;
        const currentIndex = posts.findIndex(p => p.id === selectedPost.id);
        if (currentIndex > 0) {
            setSelectedPost(posts[currentIndex - 1]);
        }
    };

    const selectedPostIndex = selectedPost ? posts.findIndex(p => p.id === selectedPost.id) : -1;
    const hasNext = selectedPostIndex < posts.length - 1;
    const hasPrev = selectedPostIndex > 0;

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">{t('common.loading')}</div>;
    }

    if (!pet) return null;

    const isOwnProfile = activePetId === pet.id;

    return (
        <div className="pb-20 bg-background min-h-screen">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b px-4 h-14 flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-6 w-6" />
                </Button>
                <h1 className="font-bold text-lg">{pet.username}</h1>
            </header>

            <div className="p-4 space-y-6">
                {/* Profile Info */}
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-full border-2 border-primary p-1">
                            <img
                                src={pet.image || "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop"}
                                alt={pet.name}
                                className="w-full h-full rounded-full object-cover"
                            />
                        </div>
                    </div>

                    <div className="flex-1 flex justify-around text-center">
                        <div>
                            <div className="font-bold text-lg">{posts.length}</div>
                            <div className="text-xs text-muted-foreground">{t('profile.posts')}</div>
                        </div>
                        <div
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => setIsMatchListOpen(true)}
                        >
                            <div className="font-bold text-lg">{pet.matchCount || 0}</div>
                            <div className="text-xs text-muted-foreground">{t('profile.matches')}</div>
                        </div>
                        <div>
                            <div className="font-bold text-lg">{pet.likesCount || 0}</div>
                            <div className="text-xs text-muted-foreground">{t('profile.likes')}</div>
                        </div>
                    </div>
                </div>

                {/* Bio Section */}
                <div className="space-y-1">
                    <h2 className="font-bold text-sm">{pet.name}</h2>
                    <p className="text-sm whitespace-pre-wrap">{pet.bio || t('profile.noBio')}</p>
                </div>

                {/* Action Buttons */}
                {!isOwnProfile && (
                    <div className="flex gap-2">
                        {matchStatus?.status === 'accepted' ? (
                            <Button
                                className="flex-1"
                                variant="outline"
                                onClick={() => setIsUnmatchDialogOpen(true)}
                            >
                                <MessageCircle className="w-4 h-4 mr-2" />
                                {t('match.connected')}
                            </Button>
                        ) : matchStatus?.status === 'pending' ? (
                            matchStatus.target_pet_id === activePetId ? (
                                <>
                                    <Button
                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                        onClick={() => acceptMatch.mutate(matchStatus.id)}
                                    >
                                        <Check className="w-4 h-4 mr-2" />
                                        {t('match.accept')}
                                    </Button>
                                    <Button
                                        className="flex-1"
                                        variant="destructive"
                                        onClick={() => rejectMatch.mutate(matchStatus.id)}
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        {t('match.reject')}
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    className="flex-1 hover:bg-destructive hover:text-destructive-foreground"
                                    variant="secondary"
                                    onClick={() => cancelMatch.mutate(matchStatus.id)}
                                    disabled={cancelMatch.isPending}
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    {t('match.cancelRequest')}
                                </Button>
                            )
                        ) : (
                            <Button
                                className="flex-1"
                                onClick={handleMatch}
                                disabled={createMatch.isPending}
                            >
                                <UserPlus className="w-4 h-4 mr-2" />
                                {t('match.connect')}
                            </Button>
                        )}
                    </div>
                )}

                {/* Content Tabs */}
                <div className="flex border-t pt-2">
                    <button className="flex-1 flex justify-center pb-2 border-b-2 border-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" /></svg>
                    </button>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-3 gap-1">
                    {posts.map((post: Post) => (
                        <div
                            key={post.id}
                            className="aspect-square bg-muted relative group cursor-pointer overflow-hidden"
                            onClick={() => handlePostClick(post)}
                        >
                            <img
                                src={post.image_url}
                                alt="Post"
                                className="w-full h-full object-cover transition-transform group-hover:scale-110"
                            />
                        </div>
                    ))}
                    {posts.length === 0 && (
                        <div className="col-span-3 py-12 text-center text-muted-foreground">
                            {t('profile.noPosts')}
                        </div>
                    )}
                </div>
            </div>

            <PostDetailModal
                postId={selectedPost?.id || null}
                open={!!selectedPost}
                onOpenChange={(open) => !open && setSelectedPost(null)}
                onNext={handleNextPost}
                onPrev={handlePrevPost}
                hasNext={hasNext}
                hasPrev={hasPrev}
            />

            <MatchListModal
                petId={pet.id}
                open={isMatchListOpen}
                onOpenChange={setIsMatchListOpen}
            />

            <AlertDialog open={isUnmatchDialogOpen} onOpenChange={setIsUnmatchDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('match.unmatchConfirmTitle')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('match.unmatchConfirmDescription')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t('common.view') === 'View' ? 'Cancel' : 'İptal'}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleUnmatch} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            {t('match.unmatch')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
