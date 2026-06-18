import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { postService } from "../services/post.service";
import type { CreatePostDTO } from "../types/post.types";
import { toast } from "sonner";
import { useActivePet } from "../../../shared/hooks/useActivePet";

export const useCreatePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreatePostDTO) => postService.create(data),
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({ queryKey: ['veterinaryPosts'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to create post");
        }
    });
};

export const useFeed = () => {
    const { activePetId } = useActivePet();
    return useQuery({
        queryKey: ['posts', 'feed', activePetId],
        queryFn: () => postService.getFeed(activePetId),
    });
};

export const usePetPosts = (petId: number, options?: { enabled?: boolean }) => {
    const { activePetId } = useActivePet();
    return useQuery({
        queryKey: ['posts', 'pet', petId, activePetId],
        queryFn: () => postService.getPetPosts(petId, activePetId),
        enabled: options?.enabled !== undefined ? options.enabled : !!petId,
    });
};

export const useRandomPosts = (limit = 21) => {
    const { activePetId } = useActivePet();
    return useQuery({
        queryKey: ['posts', 'random', activePetId],
        queryFn: () => postService.getRandomPosts(limit, activePetId),
        staleTime: Infinity, // Keep data fresh indefinitely
        gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
        refetchOnWindowFocus: false,
        refetchOnMount: false
    });
};

export const useLikePost = (options?: { onSuccess?: () => void }) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, petId }: { id: number, petId: number }) => postService.like(id, petId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            options?.onSuccess?.();
        }
    });
};

export const useUnlikePost = (options?: { onSuccess?: () => void }) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, petId }: { id: number, petId: number }) => postService.unlike(id, petId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            options?.onSuccess?.();
        }
    });
};

export const useCommentPost = (options?: { onSuccess?: () => void }) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, content, petId }: { id: number, content: string, petId: number }) => postService.comment(id, content, petId),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({ queryKey: ['comments', variables.id] });
            toast.success(data.message);
            options?.onSuccess?.();
        }
    });
};



export const usePostComments = (postId: number) => {
    return useInfiniteQuery({
        queryKey: ['comments', postId],
        queryFn: ({ pageParam = 1 }) => postService.getComments(postId, pageParam),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            if (lastPage.pagination.currentPage < lastPage.pagination.lastPage) {
                return lastPage.pagination.currentPage + 1;
            }
            return undefined;
        },
        enabled: !!postId
    });
};

export const useDeleteComment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ postId, commentId }: { postId: number, commentId: number }) => postService.deleteComment(postId, commentId),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            toast.success(data.message);
        }
    });
};

export const useSavePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, petId }: { id: number, petId: number }) => postService.save(id, petId),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            toast.success(data.message);
        }
    });
};

export const useUnsavePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, petId }: { id: number, petId: number }) => postService.unsave(id, petId),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            toast.success(data.message);
        }
    });
};

export const useDeletePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => postService.delete(id),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({ queryKey: ['veterinaryPosts'] });
            toast.success(data.message);
        }
    });
};
