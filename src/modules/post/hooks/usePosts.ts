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

export const usePetPosts = (petId: number) => {
    const { activePetId } = useActivePet();
    return useQuery({
        queryKey: ['posts', 'pet', petId, activePetId],
        queryFn: () => postService.getPetPosts(petId, activePetId),
        enabled: !!petId,
    });
};

export const useLikePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, petId }: { id: number, petId: number }) => postService.like(id, petId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        }
    });
};

export const useUnlikePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, petId }: { id: number, petId: number }) => postService.unlike(id, petId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        }
    });
};

export const useCommentPost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, content, petId }: { id: number, content: string, petId: number }) => postService.comment(id, content, petId),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({ queryKey: ['comments', variables.id] });
            toast.success(data.message);
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
            toast.success(data.message);
        }
    });
};
