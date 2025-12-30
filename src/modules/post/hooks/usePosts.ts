import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
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
        mutationFn: ({ id, content, petId }: { id: number, content: string, petId: number }) => postService.comment(id, content, petId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({ queryKey: ['comments', variables.id] });
            toast.success("Comment added");
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
