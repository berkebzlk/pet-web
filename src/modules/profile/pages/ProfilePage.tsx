import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMyPets } from '@/modules/pet/hooks/usePets';
import { useAuthUser } from '@/modules/auth/hooks/useAuth';
import { Button } from '@/shared/components/ui/button';
import { Plus, Settings, ChevronDown, MapPin, Phone, Globe, Stethoscope } from 'lucide-react';
import type { Pet } from '@/modules/pet/types/pet.types';
import { Modal } from '@/shared/components/ui/modal';
import { PetForm } from '@/modules/pet/components/PetForm';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/shared/components/ui/dropdown-menu";

import { useNavigate } from 'react-router-dom';
import { usePetPosts } from '@/modules/post/hooks/usePosts';
import { PostDetailModal } from '@/modules/post/components/PostDetailModal';
import type { Post } from '@/modules/post/types/post.types';
import { useActivePet } from '@/shared/hooks/useActivePet';
import { useVeterinaryPosts } from '@/modules/veterinary/hooks/useVeterinary';

import { CreatePostModal } from '@/modules/post/components/CreatePostModal';

import { MatchListModal } from '@/modules/match/components/MatchListModal';
import { VeterinaryForm } from '@/modules/veterinary/components/VeterinaryForm';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';

export function ProfilePage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { data } = useMyPets();
    const { data: user } = useAuthUser();
    const { activeProfileType, activeProfileId, setActiveProfile } = useActivePet();

    const pets = data?.data?.data || [];
    const isClinic = activeProfileType === 'veterinary';
    const clinic = user?.veterinaryProfile;

    const [isAddPetOpen, setIsAddPetOpen] = useState(false);
    const [isEditClinicOpen, setIsEditClinicOpen] = useState(false);
    const [isAddVetProfileOpen, setIsAddVetProfileOpen] = useState(false);
    const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
    const [isMatchListOpen, setIsMatchListOpen] = useState(false);
    const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    const handleEditPet = (pet: Pet) => {
        setSelectedPet(pet);
        setIsAddPetOpen(true);
    };

    const handleCloseModal = () => {
        setIsAddPetOpen(false);
        setSelectedPet(null);
    };

    const currentPet = !isClinic && activeProfileId ? pets.find((p: Pet) => p.id === activeProfileId) : (pets[0] || null);

    // Fetch posts for current pet/clinic
    const { data: petPosts = [] } = usePetPosts(!isClinic ? (currentPet?.id || 0) : 0);
    const { data: clinicPostsData } = useVeterinaryPosts(isClinic ? (clinic?.id || 0) : 0);
    const clinicPosts = clinicPostsData?.data || [];
    const posts = isClinic ? clinicPosts : petPosts;

    const handlePostClick = (post: Post) => {
        if (window.innerWidth < 768) {
            // Mobile: Navigate to feed page
            navigate('/app/posts', { state: { initialPostId: post.id, petId: currentPet?.id } });
        } else {
            // Desktop: Open modal
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

    return (
        <div className="pb-20">
            {/* ... Header and Profile Info ... */}
            {/* Header */}
            <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b px-4 h-14 flex items-center justify-between">
                <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
                        <span className="font-bold text-lg">{isClinic ? clinic?.clinicName : (currentPet?.username || user?.name)}</span>
                        <ChevronDown className="w-4 h-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                        {pets.map((pet: Pet) => (
                            <DropdownMenuItem key={pet.id} onClick={() => {
                                setActiveProfile(pet.id, 'pet');
                                window.location.reload();
                            }}>
                                <div className="flex items-center gap-2 w-full">
                                    <div className="w-6 h-6 rounded-full overflow-hidden bg-muted">
                                        {pet.image ? (
                                            <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-primary/10 text-[10px]">
                                                {pet.name[0]}
                                            </div>
                                        )}
                                    </div>
                                    <span className="flex-1 truncate">{pet.username}</span>
                                    {!isClinic && currentPet?.id === pet.id && <div className="w-2 h-2 rounded-full bg-primary" />}
                                </div>
                            </DropdownMenuItem>
                        ))}
                        {clinic && (
                            <DropdownMenuItem onClick={() => {
                                setActiveProfile(clinic.id, 'veterinary');
                                window.location.reload();
                            }}>
                                <div className="flex items-center gap-2 w-full">
                                    <div className="w-6 h-6 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                                        {clinic.profilePhoto ? (
                                            <img src={clinic.profilePhoto} alt={clinic.clinicName} className="w-full h-full object-cover" />
                                        ) : (
                                            <Stethoscope className="w-4 h-4 text-teal-600" />
                                        )}
                                    </div>
                                    <span className="flex-1 truncate">{clinic.clinicName}</span>
                                    {isClinic && <div className="w-2 h-2 rounded-full bg-teal-600" />}
                                </div>
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setIsAddPetOpen(true)} className="text-primary cursor-pointer">
                            <Plus className="w-4 h-4 mr-2" />
                            {t('pet.add')}
                        </DropdownMenuItem>
                        {!clinic && (
                            <DropdownMenuItem onClick={() => setIsAddVetProfileOpen(true)} className="text-teal-600 cursor-pointer font-semibold">
                                <Stethoscope className="w-4 h-4 mr-2" />
                                Veteriner Profili Oluştur
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => setIsAddPetOpen(true)}>
                        <Plus className="h-6 w-6" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => navigate('/app/settings')}>
                        <Settings className="h-6 w-6" />
                    </Button>
                </div>
            </header>

            {isClinic ? (
                <>
                    {/* Cover Banner */}
                    <div className="h-40 md:h-48 w-full bg-gradient-to-r from-teal-500/20 to-purple-500/20 overflow-hidden relative border-b">
                        <img
                            src={clinic?.coverPhoto || "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200&h=400&fit=crop"}
                            alt="Cover"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="p-4 space-y-6">
                        {/* Profile Header (Avatar and Name) */}
                        <div className="flex items-center gap-4 -mt-14 relative z-10 px-2">
                            <div className="w-20 h-20 rounded-full border-4 border-background bg-card p-0.5 overflow-hidden shadow-md shrink-0">
                                <img
                                    src={clinic?.profilePhoto || "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=400&fit=crop"}
                                    alt={clinic?.clinicName}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            </div>
                            <div className="pt-8 mt-8">
                                <h2 className="font-bold text-xl text-foreground flex items-center gap-2">
                                    {clinic?.clinicName}
                                    <Stethoscope className="w-5 h-5 text-teal-600 shrink-0" />
                                </h2>
                                <p className="text-xs text-muted-foreground">
                                    {clinic?.city || ''} • Veteriner Hekim
                                </p>
                            </div>
                        </div>

                        {/* Profile Stats Row */}
                        <div className="flex items-center gap-6 py-2.5 border-y text-sm px-2">
                            <div className="flex items-center gap-1.5">
                                <span className="font-bold text-foreground">{posts.length}</span>
                                <span className="text-muted-foreground">{t('post.title')}</span>
                            </div>
                        </div>

                        {/* Bio Section */}
                        <div className="space-y-1 px-2">
                            <p className="text-sm whitespace-pre-wrap">{clinic?.about || "Hakkında yazısı bulunmuyor."}</p>

                            <div className="space-y-2 text-sm text-muted-foreground border-t pt-3 mt-3">
                                {clinic?.city && (
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-teal-600" />
                                        <span>{clinic.city}</span>
                                    </div>
                                )}
                                {clinic?.phone && (
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-teal-600" />
                                        <span>{clinic.phone}</span>
                                    </div>
                                )}
                                {clinic?.website && (
                                    <div className="flex items-center gap-2">
                                        <Globe className="w-4 h-4 text-teal-600" />
                                        <a href={clinic.website.startsWith('http') ? clinic.website : `https://${clinic.website}`} target="_blank" rel="noreferrer" className="hover:underline text-teal-600 font-medium">
                                            {clinic.website}
                                        </a>
                                    </div>
                                )}
                                {clinic?.specialties && clinic.specialties.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 pt-2">
                                        {clinic.specialties.map((spec: string) => (
                                            <span key={spec} className="px-2.5 py-0.5 bg-teal-50 text-teal-700 border border-teal-200 rounded-full text-xs font-semibold">
                                                {spec}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <Button className="flex-1" variant="outline" size="sm" onClick={() => setIsEditClinicOpen(true)}>
                                Klinik Bilgilerini Düzenle
                            </Button>
                            <Button className="flex-1" variant="outline" size="sm" onClick={() => setIsCreatePostOpen(true)}>
                                Klinik Gönderisi Paylaş
                            </Button>
                        </div>
                    </div>
                </>
            ) : (
                <div className="p-4 space-y-6">
                    {/* Profile Info */}
                    <div className="flex items-center gap-6 p-4 border-b">
                        <div className="relative">
                            <Avatar className="w-20 h-20">
                                <AvatarImage src={currentPet?.image || undefined} alt={currentPet?.name} />
                                <AvatarFallback>{currentPet?.name?.[0]}</AvatarFallback>
                            </Avatar>
                        </div>

                        <div className="flex-1 flex justify-around text-center">
                            <div>
                                <div className="font-bold text-lg">{posts.length}</div>
                                <div className="text-xs text-muted-foreground">Posts</div>
                            </div>
                            <div
                                className="cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => setIsMatchListOpen(true)}
                            >
                                <div className="font-bold text-lg">{currentPet?.matchCount || 0}</div>
                                <div className="text-xs text-muted-foreground">Matches</div>
                            </div>
                            <div>
                                <div className="font-bold text-lg">{currentPet?.likesCount || 0}</div>
                                <div className="text-xs text-muted-foreground">Likes</div>
                            </div>
                        </div>
                    </div>

                    {/* Bio Section */}
                    <div className="space-y-1 p-4">
                        <h2 className="font-bold text-sm">{currentPet?.name}</h2>
                        <p className="text-sm whitespace-pre-wrap">{currentPet?.bio || "No bio yet."}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        <Button className="flex-1" variant="outline" size="sm" onClick={() => currentPet && handleEditPet(currentPet)}>
                            Edit Profile
                        </Button>
                        <Button className="flex-1" variant="outline" size="sm" onClick={() => setIsCreatePostOpen(true)}>
                            Create Post
                        </Button>
                    </div>
                </div>
            )}

            {/* Content Tabs */}
            <div className="flex border-t pt-2">
                <button className="flex-1 flex justify-center pb-2 border-b-2 border-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" /></svg>
                </button>
                <button className="flex-1 flex justify-center pb-2 text-muted-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.28 3.6-1.28 5.14 0 .34.29.56.7.56 1.15 0 1.63-1.56 2.75-3.5 2.87-1.31.08-2.07.81-2.2 1.98-.13 1.17.64 2.15 1.79 2.28 2.01.23 3.09 2.02 1.48 3.63-1.61 1.61-3.4 2.53-5.27 2.09-1.17-.28-2.15.49-2.28 1.66-.12 1.17.61 1.93 1.78 2.01 1.94.12 3.06 1.75 1.43 3.38-.29.29-.7.51-1.15.51-1.45 0-1.45-2.11-.17-3.6" /></svg>
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
                        No posts yet.
                    </div>
                )}
            </div>

            <Modal
                isOpen={isAddPetOpen}
                onClose={handleCloseModal}
                title={selectedPet ? t('pet.edit') : t('pet.add')}
            >
                <PetForm
                    initialData={selectedPet || undefined}
                    onSuccess={handleCloseModal}
                />
            </Modal>

            <CreatePostModal
                open={isCreatePostOpen}
                onOpenChange={setIsCreatePostOpen}
            />

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
                petId={currentPet?.id || null}
                open={isMatchListOpen}
                onOpenChange={setIsMatchListOpen}
            />

            <Modal
                isOpen={isEditClinicOpen}
                onClose={() => setIsEditClinicOpen(false)}
                title="Klinik Bilgilerini Düzenle"
            >
                {clinic && (
                    <VeterinaryForm
                        initialData={{
                            clinicName: clinic.clinicName,
                            city: clinic.city,
                            phone: clinic.phone,
                            website: clinic.website,
                            about: clinic.about,
                            specialties: clinic.specialties,
                        }}
                        onSuccess={() => setIsEditClinicOpen(false)}
                    />
                )}
            </Modal>

            <Modal
                isOpen={isAddVetProfileOpen}
                onClose={() => setIsAddVetProfileOpen(false)}
                title="Veteriner Profili Oluştur"
            >
                <VeterinaryForm
                    onSuccess={() => {
                        setIsAddVetProfileOpen(false);
                        window.location.reload();
                    }}
                />
            </Modal>
        </div>
    );
}

