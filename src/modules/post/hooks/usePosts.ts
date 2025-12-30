import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { postService } from "../services/post.service";
import type { CreatePostDTO } from "../types/post.types";
import { toast } from "sonner";

export const useCreatePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreatePostDTO) => postService.create(data),
        onSuccess: () => {
            toast.success("Post created successfully");
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to create post");
        }
    });
};

export const useFeed = () => {
    return useQuery({
        queryKey: ['posts', 'feed'],
        queryFn: postService.getFeed,
    });
};

export const usePetPosts = (petId: number) => {
    return useQuery({
        queryKey: ['posts', 'pet', petId],
        queryFn: () => postService.getPetPosts(petId),
        enabled: !!petId,
    });
};

export const useLikePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => postService.like(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        }
    });
};

export const useUnlikePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => postService.unlike(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        }
    });
};

export const useCommentPost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, content }: { id: number, content: string }) => postService.comment(id, content),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            toast.success("Comment added");
        }
    });
};

export const useDeleteComment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ postId, commentId }: { postId: number, commentId: number }) => postService.deleteComment(postId, commentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            toast.success("Comment deleted");
        }
    });
};

export const useSavePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => postService.save(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            toast.success("Post saved");
        }
    });
};

export const useUnsavePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => postService.unsave(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            toast.success("Post removed from saved");
        }
    });
};

export const useDeletePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => postService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            toast.success("Post deleted successfully");
        }
    });
};
