import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVeterinaryProfile, useVeterinaryPosts } from '../hooks/useVeterinary';
import { Button } from '@/shared/components/ui/button';
import { PostDetailModal } from '@/modules/post/components/PostDetailModal';
import { MapPin, Phone, Globe, ArrowLeft, Heart, MessageSquare, Stethoscope } from 'lucide-react';

export function VeterinaryDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const profileId = Number(id);

    const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

    // Fetch profile and posts
    const { data: profileData, isLoading: isProfileLoading, isError: isProfileError } = useVeterinaryProfile(profileId);
    const { data: postsData, isLoading: isPostsLoading } = useVeterinaryPosts(profileId);

    const profile = profileData?.data;
    const posts: any[] = postsData?.data || [];

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
            <div className="bg-card border rounded-2xl overflow-hidden shadow-sm mb-6">
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
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span>{profile.city}</span>
                        </div>
                    </div>
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

                {/* About and Posts Feed */}
                <div className="md:col-span-2 space-y-6">
                    {/* About */}
                    <div className="bg-card border rounded-2xl p-6 shadow-sm">
                        <h3 className="font-semibold text-lg border-b pb-3 mb-3 text-foreground">Hakkımızda</h3>
                        <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                            {profile.about || 'Klinik hakkında detaylı açıklama bulunmamaktadır.'}
                        </p>
                    </div>

                    {/* Clinic Posts Feed */}
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
