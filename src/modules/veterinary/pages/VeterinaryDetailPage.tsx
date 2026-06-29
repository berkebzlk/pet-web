import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVeterinaryProfile, useVeterinaryPosts, useVeterinaryReviews, useAddVeterinaryReview } from '../hooks/useVeterinary';
import { useAuthUser } from '@/modules/auth/hooks/useAuth';
import { useActivePet } from '@/modules/pet/context/ActivePetContext';
import { Button } from '@/shared/components/ui/button';
import { PostDetailModal } from '@/modules/post/components/PostDetailModal';
import { MapPin, Phone, Globe, ArrowLeft, Heart, MessageSquare, Stethoscope, Star } from 'lucide-react';

export function VeterinaryDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const profileId = Number(id);

    const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState<'posts' | 'reviews'>('posts');

    // Review form state
    const [reviewPetId, setReviewPetId] = useState<number>(0);
    const [reviewRating, setReviewRating] = useState<number>(5);
    const [hoverRating, setHoverRating] = useState<number | null>(null);
    const [reviewComment, setReviewComment] = useState('');

    // Fetch data
    const { data: profileData, isLoading: isProfileLoading, isError: isProfileError } = useVeterinaryProfile(profileId);
    const { data: postsData, isLoading: isPostsLoading } = useVeterinaryPosts(profileId);
    const { data: reviews = [] } = useVeterinaryReviews(profileId);
    const { data: authUser } = useAuthUser();
    const { pets, activePet } = useActivePet();

    const addReviewMutation = useAddVeterinaryReview(profileId);

    const profile = profileData?.data;
    const posts: any[] = postsData?.data || [];

    // Initialize pet selection when pets are loaded
    React.useEffect(() => {
        if (pets.length > 0 && !reviewPetId) {
            const defaultPet = pets.find((p: any) => p.id === activePet?.id) || pets[0];
            setReviewPetId(defaultPet.id);
        }
    }, [pets, activePet, reviewPetId]);

    const handleReviewSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!reviewPetId) return;

        addReviewMutation.mutate({
            pet_id: reviewPetId,
            rating: reviewRating,
            comment: reviewComment || undefined,
        }, {
            onSuccess: () => {
                setReviewComment('');
                setReviewRating(5);
            }
        });
    };

    if (isProfileLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-40 gap-3">
                <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
                <span className="text-sm text-muted-foreground">Profil yükleniyor...</span>
            </div>
        );
    }

    if (isProfileError || !profile) {
        return (
            <div className="container mx-auto px-4 py-10 text-center">
                <p className="text-destructive mb-4">Profil yüklenirken bir hata oluştu veya profil bulunamadı.</p>
                <Button onClick={() => navigate('/app/veterinarians')}>Geri Dön</Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-4 pb-20 max-w-4xl">
            {/* Back Button */}
            <button
                onClick={() => navigate('/app/veterinarians')}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors cursor-pointer"
            >
                <ArrowLeft className="w-4 h-4" />
                Rehbere Geri Dön
            </button>

            {/* Profile Header Card */}
            <div className="bg-card border rounded-2xl overflow-hidden shadow-sm mb-6 relative">
                {/* Cover Photo */}
                <div className="h-48 md:h-64 w-full relative bg-gradient-to-r from-teal-400 to-emerald-500">
                    {profile.coverPhoto && (
                        <img
                            src={profile.coverPhoto}
                            alt={profile.clinicName}
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>

                {/* Profile Meta */}
                <div className="p-6 relative pt-16 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    {/* Avatar Offset */}
                    <div className="w-24 h-24 rounded-2xl border-4 border-card bg-card overflow-hidden absolute -top-12 left-6 shadow-md">
                        {profile.profilePhoto ? (
                            <img
                                src={profile.profilePhoto}
                                alt={profile.clinicName}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted text-primary font-bold text-3xl">
                                {profile.clinicName[0]}
                            </div>
                        )}
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            {profile.clinicName}
                            <span className="inline-block p-1 bg-teal-100 dark:bg-teal-900 rounded text-teal-600 dark:text-teal-400">
                                <Stethoscope className="w-4 h-4" />
                            </span>
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 mt-2">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <MapPin className="w-4 h-4 text-primary shrink-0" />
                                <span>{profile.city}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                                <span className="text-sm font-semibold text-foreground">
                                    {profile.averageRating ? Number(profile.averageRating).toFixed(1) : '0.0'}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    ({profile.reviewsCount || 0} değerlendirme)
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* "My Clinic" Badge */}
                    {authUser?.id === profile.userId && (
                        <div className="self-start md:self-end">
                            <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full shadow-sm">
                                Benim Kliniğim
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Contact and Specialties */}
                <div className="md:col-span-1 space-y-6">
                    {/* Contact details */}
                    <div className="bg-card border rounded-2xl p-5 shadow-sm space-y-4">
                        <h3 className="font-semibold border-b pb-2 text-foreground">İletişim Bilgileri</h3>
                        
                        {profile.phone ? (
                            <div className="space-y-1">
                                <span className="text-xs text-muted-foreground block">Telefon</span>
                                <a
                                    href={`tel:${profile.phone}`}
                                    className="text-sm font-medium hover:text-primary flex items-center gap-1.5 transition-colors"
                                >
                                    <Phone className="w-4 h-4 text-primary shrink-0" />
                                    {profile.phone}
                                </a>
                            </div>
                        ) : (
                            <p className="text-xs text-muted-foreground">Telefon girilmemiş.</p>
                        )}

                        {profile.website && (
                            <div className="space-y-1">
                                <span className="text-xs text-muted-foreground block">Website</span>
                                <a
                                    href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-sm font-medium hover:text-primary flex items-center gap-1.5 transition-colors"
                                >
                                    <Globe className="w-4 h-4 text-primary shrink-0" />
                                    {profile.website}
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Specialties */}
                    <div className="bg-card border rounded-2xl p-5 shadow-sm">
                        <h3 className="font-semibold border-b pb-2 mb-3 text-foreground">Uzmanlık Alanları</h3>
                        {profile.specialties && profile.specialties.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5">
                                {profile.specialties.map((spec: string) => (
                                    <span
                                        key={spec}
                                        className="px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-semibold"
                                    >
                                        {spec}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-muted-foreground">Belirtilmemiş.</p>
                        )}
                    </div>
                </div>

                {/* About, Posts, and Reviews Feed */}
                <div className="md:col-span-2 space-y-6">
                    {/* About */}
                    <div className="bg-card border rounded-2xl p-6 shadow-sm">
                        <h3 className="font-semibold text-lg border-b pb-3 mb-3 text-foreground">Hakkımızda</h3>
                        <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                            {profile.about || 'Klinik hakkında detaylı açıklama bulunmamaktadır.'}
                        </p>
                    </div>

                    {/* Interactive Tabs */}
                    <div className="flex border-b border-border">
                        <button
                            onClick={() => setActiveTab('posts')}
                            className={`px-4 py-2.5 font-medium text-sm border-b-2 cursor-pointer transition-colors ${
                                activeTab === 'posts'
                                    ? 'border-primary text-primary font-semibold'
                                    : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            Paylaşımlar ({posts.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`px-4 py-2.5 font-medium text-sm border-b-2 cursor-pointer transition-colors ${
                                activeTab === 'reviews'
                                    ? 'border-primary text-primary font-semibold'
                                    : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            Değerlendirmeler ({reviews.length})
                        </button>
                    </div>

                    {/* Tab: Posts */}
                    {activeTab === 'posts' && (
                        <div className="bg-card border rounded-2xl p-6 shadow-sm">
                            <h3 className="font-semibold text-lg border-b pb-3 mb-4 text-foreground flex items-center gap-2">
                                Paylaşımlar
                                <span className="text-xs font-normal bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                                    {posts.length}
                                </span>
                            </h3>

                            {isPostsLoading && (
                                <div className="flex justify-center py-10">
                                    <div className="animate-spin h-6 w-6 border-2 border-primary rounded-full border-t-transparent"></div>
                                </div>
                            )}

                            {!isPostsLoading && posts.length === 0 && (
                                <div className="text-center py-12 text-muted-foreground text-sm">
                                    Kliniğe ait henüz bir paylaşım bulunmuyor.
                                </div>
                            )}

                            {!isPostsLoading && posts.length > 0 && (
                                <div className="grid grid-cols-3 gap-2">
                                    {posts.map((post) => (
                                        <div
                                            key={post.id}
                                            className="aspect-square bg-muted relative group cursor-pointer overflow-hidden rounded-lg shadow-sm"
                                            onClick={() => setSelectedPostId(post.id)}
                                        >
                                            <img
                                                src={post.image_url}
                                                alt={post.description || 'Klinik Gönderisi'}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white">
                                                {post.likes_count !== undefined && (
                                                    <div className="flex items-center gap-1 text-sm font-semibold">
                                                        <Heart className="w-4 h-4 fill-white" />
                                                        {post.likes_count}
                                                    </div>
                                                )}
                                                {post.comments_count !== undefined && (
                                                    <div className="flex items-center gap-1 text-sm font-semibold">
                                                        <MessageSquare className="w-4 h-4 fill-white" />
                                                        {post.comments_count}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab: Reviews */}
                    {activeTab === 'reviews' && (
                        <div className="space-y-6">
                            {/* Submit Rating & Review Form */}
                            {authUser?.id !== profile.userId && (
                                <div className="bg-card border rounded-2xl p-5 shadow-sm">
                                    <h4 className="font-semibold text-base mb-4 text-foreground flex items-center gap-2">
                                        <MessageSquare className="w-5 h-5 text-primary" />
                                        Değerlendirme Yap
                                    </h4>

                                    {pets.length === 0 ? (
                                        <p className="text-sm text-muted-foreground bg-muted p-3 rounded-xl">
                                            Değerlendirme yapabilmek için profilinizde en az bir evcil hayvan bulunmalıdır.
                                        </p>
                                    ) : (
                                        <form onSubmit={handleReviewSubmit} className="space-y-4">
                                            {/* Pet selection */}
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-semibold text-muted-foreground block">
                                                    Hangi Evcil Hayvanınız Adına?
                                                </label>
                                                <div className="relative">
                                                    <select
                                                        className="w-full p-2.5 pr-8 rounded-xl bg-background border border-input focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm transition-all appearance-none cursor-pointer text-foreground"
                                                        value={reviewPetId}
                                                        onChange={(e) => setReviewPetId(Number(e.target.value))}
                                                    >
                                                        {pets.map((pet) => (
                                                            <option key={pet.id} value={pet.id}>
                                                                {pet.name} ({pet.breed || pet.type})
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
                                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Interactive Rating Select */}
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-semibold text-muted-foreground block">
                                                    Puanınız (1 - 5 Yıldız)
                                                </label>
                                                <div className="flex gap-1.5">
                                                    {[1, 2, 3, 4, 5].map((star) => {
                                                        const isFilled = star <= (hoverRating ?? reviewRating);
                                                        return (
                                                            <button
                                                                key={star}
                                                                type="button"
                                                                onClick={() => setReviewRating(star)}
                                                                onMouseEnter={() => setHoverRating(star)}
                                                                onMouseLeave={() => setHoverRating(null)}
                                                                className="p-1 hover:scale-110 transition-transform cursor-pointer"
                                                            >
                                                                <Star
                                                                    className={`w-7 h-7 ${
                                                                        isFilled
                                                                            ? 'text-amber-500 fill-amber-500'
                                                                            : 'text-muted border-muted'
                                                                    }`}
                                                                />
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Review Comment Box */}
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-semibold text-muted-foreground block">
                                                    Yorumunuz
                                                </label>
                                                <textarea
                                                    placeholder="Deneyiminizi ve fikirlerinizi buraya yazın..."
                                                    rows={3}
                                                    className="w-full p-3 rounded-xl bg-background border border-input focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm transition-all text-foreground placeholder:text-muted-foreground"
                                                    value={reviewComment}
                                                    onChange={(e) => setReviewComment(e.target.value)}
                                                />
                                            </div>

                                            <Button
                                                type="submit"
                                                className="w-full"
                                                disabled={addReviewMutation.isPending}
                                            >
                                                {addReviewMutation.isPending ? 'Değerlendiriliyor...' : 'Değerlendirmeyi Gönder'}
                                            </Button>
                                        </form>
                                    )}
                                </div>
                            )}

                            {/* Reviews list */}
                            <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
                                <h3 className="font-semibold text-lg border-b pb-3 text-foreground">
                                    Değerlendirmeler ({reviews.length})
                                </h3>

                                {reviews.length === 0 ? (
                                    <div className="text-center py-10 text-muted-foreground text-sm">
                                        Bu klinikle ilgili henüz değerlendirme bulunmuyor. İlk değerlendiren siz olun!
                                    </div>
                                ) : (
                                    <div className="space-y-4 divide-y divide-border">
                                        {reviews.map((rev: any, index: number) => (
                                            <div key={rev.id} className={`pt-4 ${index === 0 ? 'pt-0' : ''}`}>
                                                <div className="flex items-start justify-between gap-4">
                                                    {/* Author (Pet Info) */}
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full overflow-hidden bg-muted border shrink-0">
                                                            {rev.pet?.image ? (
                                                                <img
                                                                    src={rev.pet.image}
                                                                    alt={rev.pet.name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-sm">
                                                                    {rev.pet?.name?.[0] || 'P'}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <span className="font-semibold text-sm text-foreground block">
                                                                {rev.pet?.name}
                                                            </span>
                                                            <span className="text-xs text-muted-foreground block">
                                                                {rev.pet?.breed || rev.pet?.type}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Rating info */}
                                                    <div className="text-right">
                                                        <div className="flex gap-0.5 justify-end">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <Star
                                                                    key={star}
                                                                    className={`w-3.5 h-3.5 ${
                                                                        star <= rev.rating
                                                                            ? 'text-amber-500 fill-amber-500'
                                                                            : 'text-muted'
                                                                    }`}
                                                                />
                                                            ))}
                                                        </div>
                                                        <span className="text-[10px] text-muted-foreground mt-1.5 block">
                                                            {new Date(rev.createdAt).toLocaleDateString('tr-TR')}
                                                        </span>
                                                    </div>
                                                </div>

                                                {rev.comment && (
                                                    <p className="text-sm mt-3 text-muted-foreground pl-13 leading-relaxed whitespace-pre-wrap">
                                                        {rev.comment}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Post Detail Modal */}
            {selectedPostId && (
                <PostDetailModal
                    postId={selectedPostId}
                    open={!!selectedPostId}
                    onOpenChange={(open) => !open && setSelectedPostId(null)}
                />
            )}
        </div>
    );
}
