import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { useGetMatches } from "../hooks/useMatch";
import { useState, useEffect } from "react";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useNavigate } from "react-router-dom";
import { Loader2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

interface MatchListModalProps {
    petId: number | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function MatchListModal({ petId, open, onOpenChange }: MatchListModalProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const debouncedSearch = useDebounce(search, 500);

    const { data, isLoading, refetch } = useGetMatches(petId || undefined, {
        search: debouncedSearch,
        page,
        per_page: 10
    }, open);

    useEffect(() => {
        if (open) {
            refetch();
        }
    }, [open, refetch]);

    const matches = data?.data?.data || [];
    const meta = data?.data?.meta;

    const handlePetClick = (username: string) => {
        onOpenChange(false);
        navigate(`/app/profile/${username}`);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] h-[600px] flex flex-col">
                <DialogHeader>
                    <DialogTitle>{t('profile.matches')}</DialogTitle>
                </DialogHeader>

                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={t('common.search')}
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1); // Reset to first page on search
                        }}
                        className="pl-8"
                    />
                </div>

                <ScrollArea className="flex-1 -mx-6 px-6">
                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                    ) : matches.length > 0 ? (
                        <div className="space-y-4 py-4">
                            {matches.map((pet: any) => (
                                <div
                                    key={pet.id}
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                                    onClick={() => handlePetClick(pet.username)}
                                >
                                    <Avatar className="h-10 w-10 border">
                                        <AvatarImage src={pet.image} />
                                        <AvatarFallback>{pet.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 overflow-hidden">
                                        <div className="font-medium truncate">{pet.name}</div>
                                        <div className="text-xs text-muted-foreground truncate">@{pet.username}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            {debouncedSearch ? t('common.noResults') : t('match.noMatches')}
                        </div>
                    )}
                </ScrollArea>

                {/* Pagination */}
                {meta && meta.last_page > 1 && (
                    <div className="flex items-center justify-between border-t pt-4 mt-auto">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1 || isLoading}
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            {t('common.prev')}
                        </Button>
                        <span className="text-xs text-muted-foreground">
                            {page} / {meta.last_page}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => Math.min(meta.last_page, p + 1))}
                            disabled={page === meta.last_page || isLoading}
                        >
                            {t('common.next')}
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
