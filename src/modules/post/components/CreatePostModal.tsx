import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { Textarea } from "@/shared/components/ui/textarea";
import { useCreatePost } from "../hooks/usePosts";
import { useActivePet } from "@/shared/hooks/useActivePet";
import { ImagePlus, Loader2 } from "lucide-react";

const formSchema = z.object({
    description: z.string().max(1000).optional(),
});

interface CreatePostModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreatePostModal({ open, onOpenChange }: CreatePostModalProps) {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const { activeProfileType, activeProfileId } = useActivePet();
    const createPost = useCreatePost();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: "",
        },
    });

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        if (!selectedImage || !activeProfileId) return;

        const payload: any = {
            image: selectedImage,
            description: values.description,
        };

        if (activeProfileType === 'veterinary') {
            payload.veterinary_profile_id = activeProfileId;
        } else {
            payload.pet_id = activeProfileId;
        }

        createPost.mutate(payload, {
            onSuccess: () => {
                onOpenChange(false);
                form.reset();
                setSelectedImage(null);
                setPreviewUrl(null);
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Post</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* Pet selection removed as per user request */}

                        <div className="flex flex-col gap-2">
                            <FormLabel>Photo</FormLabel>
                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50">
                                    {previewUrl ? (
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <ImagePlus className="w-8 h-8 mb-4 text-muted-foreground" />
                                            <p className="text-sm text-muted-foreground">Click to upload photo</p>
                                        </div>
                                    )}
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageSelect} />
                                </label>
                            </div>
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }: { field: any }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Write a caption..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full" disabled={createPost.isPending || !selectedImage}>
                            {createPost.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Share
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
