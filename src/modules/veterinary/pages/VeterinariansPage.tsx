import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVeterinarians } from '../hooks/useVeterinary';
import type { VeterinaryProfile } from '../types/veterinary.types';
import { Button } from '@/shared/components/ui/button';
import { MapPin, Phone, Globe, Stethoscope } from 'lucide-react';

export function VeterinariansPage() {
    const navigate = useNavigate();
    const [cityFilter, setCityFilter] = useState('');

    // Fetch veterinarians from API
    const { data, isLoading, isError } = useVeterinarians({
        city: cityFilter || undefined,
    });

    const profiles: VeterinaryProfile[] = data?.data?.data || [];

    const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCityFilter(e.target.value);
    };

    return (
        <div className="container mx-auto px-4 py-4 pb-20">
            {/* Header */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2 text-foreground">
                        <Stethoscope className="w-6 h-6 text-primary" />
                        Veteriner Klinik Rehberi
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        PetMet üyesi klinik ve hekimleri keşfedin.
                    </p>
                </div>

                {/* Filter Input */}
                <div className="relative w-full md:w-72">
                    <input
                        type="text"
                        placeholder="Şehre göre filtrele (Örn: Bursa)..."
                        className="w-full p-3 pl-10 rounded-lg bg-card border border-input focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm transition-all"
                        value={cityFilter}
                        onChange={handleCityChange}
                    />
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
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
                        className="bg-card border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full"
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

                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-2">
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
