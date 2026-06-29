import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVeterinarians, useVeterinaryCities } from '../hooks/useVeterinary';
import { useAuthUser } from '@/modules/auth/hooks/useAuth';
import type { VeterinaryProfile } from '../types/veterinary.types';
import { Button } from '@/shared/components/ui/button';
import { MapPin, Phone, Stethoscope, Star, Search } from 'lucide-react';

const AVAILABLE_SPECIALTIES = [
    'Kedi',
    'Köpek',
    'Kuş',
    'Cerrahi',
    'Dahiliye',
    'Aşı / Parazit',
    'Diş Sağlığı',
    'Egzotik Hayvanlar',
    'Laboratuvar',
    'Göz Hastalıkları'
];

export function VeterinariansPage() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState('');
    const [sortOption, setSortOption] = useState('newest');

    // Get dynamic cities list from API
    const { data: cities } = useVeterinaryCities();
    const { data: authUser } = useAuthUser();

    // Determine sorting parameters based on select value
    let sortByParam: any = { created_at: 'desc' };
    if (sortOption === 'rating') {
        sortByParam = { average_rating: 'desc' };
    } else if (sortOption === 'alphabetical') {
        sortByParam = { clinic_name: 'asc' };
    }

    // Fetch veterinarians from API with filters and sorting
    const { data, isLoading, isError } = useVeterinarians({
        search: searchTerm || undefined,
        filters: {
            city: selectedCity || undefined,
            specialty: selectedSpecialty || undefined,
        },
        sortBy: sortByParam,
    });

    const profiles: VeterinaryProfile[] = data?.data?.data || [];

    return (
        <div className="container mx-auto px-4 py-4 pb-20">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold flex items-center gap-2 text-foreground">
                    <Stethoscope className="w-6 h-6 text-primary" />
                    Veteriner Klinik Rehberi
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    PetMet üyesi klinik ve hekimleri keşfedin.
                </p>
            </div>

            {/* Advanced Filters Grid */}
            <div className="bg-card border rounded-2xl p-4 mb-6 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Search by Clinic Name */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Klinik adı ara..."
                            className="w-full p-2.5 pl-9 rounded-xl bg-background border border-input focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm transition-all text-foreground placeholder:text-muted-foreground"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    </div>

                    {/* City Selection Dropdown */}
                    <div className="relative">
                        <select
                            className="w-full p-2.5 pl-9 pr-8 rounded-xl bg-background border border-input focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm transition-all appearance-none cursor-pointer text-foreground"
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                        >
                            <option value="">Tüm Şehirler</option>
                            {cities?.map((city) => (
                                <option key={city} value={city}>
                                    {city}
                                </option>
                            ))}
                        </select>
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>

                    {/* Specialty Selection Dropdown */}
                    <div className="relative">
                        <select
                            className="w-full p-2.5 pl-9 pr-8 rounded-xl bg-background border border-input focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm transition-all appearance-none cursor-pointer text-foreground"
                            value={selectedSpecialty}
                            onChange={(e) => setSelectedSpecialty(e.target.value)}
                        >
                            <option value="">Tüm Uzmanlıklar</option>
                            {AVAILABLE_SPECIALTIES.map((spec) => (
                                <option key={spec} value={spec}>
                                    {spec}
                                </option>
                            ))}
                        </select>
                        <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>

                    {/* Sorting Selection Dropdown */}
                    <div className="relative">
                        <select
                            className="w-full p-2.5 pl-9 pr-8 rounded-xl bg-background border border-input focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm transition-all appearance-none cursor-pointer text-foreground"
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                        >
                            <option value="newest">En Yeni</option>
                            <option value="rating">En Yüksek Puan</option>
                            <option value="alphabetical">Alfabetik (A-Z)</option>
                        </select>
                        <Star className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Loading / Error States */}
            {isLoading && (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
                    <span className="text-sm text-muted-foreground">Veterinerler yükleniyor...</span>
                </div>
            )}

            {isError && (
                <div className="text-center py-20 text-destructive">
                    Veterinerler yüklenirken bir hata oluştu. Lütfen tekrar deneyin.
                </div>
            )}

            {/* Empty State */}
            {!isLoading && !isError && profiles.length === 0 && (
                <div className="text-center py-20 bg-card border border-dashed rounded-2xl">
                    <Stethoscope className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <h3 className="font-semibold text-lg">Kayıt Bulunamadı</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Arama kriterlerinize uygun veteriner profili bulunmamaktadır.
                    </p>
                </div>
            )}

            {/* Listing Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profiles.map((profile) => (
                    <div
                        key={profile.id}
                        className="bg-card border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full relative"
                    >
                        {/* Cover image area */}
                        <div className="h-32 w-full relative bg-gradient-to-r from-teal-400 to-emerald-500">
                            {profile.coverPhoto && (
                                <img
                                    src={profile.coverPhoto}
                                    alt={profile.clinicName}
                                    className="w-full h-full object-cover"
                                />
                            )}
                            
                            {/* "My Clinic" Badge */}
                            {authUser?.id === profile.userId && (
                                <span className="absolute top-3 right-3 px-2.5 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full shadow-md z-10">
                                    Benim Kliniğim
                                </span>
                            )}
                        </div>

                        {/* Card Content */}
                        <div className="p-5 flex-1 flex flex-col relative pt-10">
                            {/* Profile photo avatar offset */}
                            <div className="w-16 h-16 rounded-2xl border-4 border-card bg-card overflow-hidden absolute -top-8 left-5 shadow-sm">
                                {profile.profilePhoto ? (
                                    <img
                                        src={profile.profilePhoto}
                                        alt={profile.clinicName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-muted text-primary font-bold text-xl">
                                        {profile.clinicName[0]}
                                    </div>
                                )}
                            </div>

                            {/* Details */}
                            <h3 className="font-bold text-lg text-foreground line-clamp-1">
                                {profile.clinicName}
                            </h3>

                            {/* Rating and Review Stats */}
                            <div className="flex items-center gap-1.5 mt-1.5">
                                <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                                <span className="text-sm font-semibold text-foreground">
                                    {profile.averageRating ? Number(profile.averageRating).toFixed(1) : '0.0'}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    ({profile.reviewsCount || 0} değerlendirme)
                                </span>
                            </div>

                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-3">
                                <MapPin className="w-4 h-4 text-primary shrink-0" />
                                <span>{profile.city}</span>
                            </div>

                            {profile.phone && (
                                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1.5">
                                    <Phone className="w-4 h-4 text-primary shrink-0" />
                                    <span>{profile.phone}</span>
                                </div>
                            )}

                            {/* Specialties tags */}
                            {profile.specialties && profile.specialties.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-4">
                                    {profile.specialties.slice(0, 3).map((spec) => (
                                        <span
                                            key={spec}
                                            className="px-2.5 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-medium"
                                        >
                                            {spec}
                                        </span>
                                    ))}
                                    {profile.specialties.length > 3 && (
                                        <span className="text-xs text-muted-foreground self-center pl-1">
                                            +{profile.specialties.length - 3} daha
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Detail Button */}
                            <div className="mt-auto pt-6">
                                <Button
                                    className="w-full cursor-pointer"
                                    variant="outline"
                                    onClick={() => navigate(`/app/veterinarians/${profile.id}`)}
                                >
                                    Detayları İncele
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
