import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postService } from '../../post/services/post.service';
import { useRandomPosts } from '../../post/hooks/usePosts';
import { petService } from '../../pet/services/pet.service';
import type { Post } from '../../post/types/post.types';
import type { Post } from '../../post/types/post.types';
import { PostDetailModal } from '../../post/components/PostDetailModal';
import { useAuthUser } from '../../auth/hooks/useAuth';

const DiscoverPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
    const navigate = useNavigate();
    const { data: user } = useAuthUser();

    // Fetch random posts using react-query with caching
    const { data: posts = [] } = useRandomPosts();

    // Handle search with debounce
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchQuery.trim()) {
                setIsSearching(true);
                try {
                    const results = await petService.searchPets(searchQuery);
                    setSearchResults(results);
                } catch (error) {
                    console.error('Search failed:', error);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSearchResults([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const handlePostClick = (postId: number) => {
        if (window.innerWidth < 768) {
            navigate('/app/posts', {
                state: {
                    initialPostId: postId,
                    posts: posts
                }
            });
        } else {
            setSelectedPostId(postId);
        }
    };

    const handleCloseModal = () => {
        setSelectedPostId(null);
    };

    return (
        <div className="container mx-auto px-4 py-4 pb-20">
            {/* Search Bar */}
            <div className="relative mb-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder={user ? `Search pets as ${user.name}...` : "Search pets..."}
                        className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border-none focus:ring-2 focus:ring-blue-500 outline-none pr-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {isSearching && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                        </div>
                    )}
                </div>

                {/* Search Results Dropdown */}
                {searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                        {searchResults.map((pet: any) => (
                            <div
                                key={pet.id}
                                className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b last:border-none border-gray-100 dark:border-gray-700"
                                onClick={() => navigate(`/app/profile/${pet.username}`)}
                            >
                                <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 overflow-hidden">
                                    {pet.image ? (
                                        <img src={pet.image || ''} alt={pet.username} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                                            {pet.username[0].toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <div className="font-semibold">{pet.username}</div>
                                    <div className="text-sm text-gray-500">{pet.name}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Random Posts Grid */}
            <div className="grid grid-cols-3 gap-1">
                {posts.map((post) => (
                    <div
                        key={post.id}
                        className="aspect-square relative cursor-pointer overflow-hidden group"
                        onClick={() => handlePostClick(post.id)}
                    >
                        <img
                            src={post.image_url || ''}
                            alt={post.description || ''}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </div>
                ))}
            </div>

            {/* Post Detail Modal */}
            {selectedPostId && (
                <PostDetailModal
                    postId={selectedPostId}
                    open={!!selectedPostId}
                    onOpenChange={(open) => !open && handleCloseModal()}
                />
            )}
        </div>
    );
};

export default DiscoverPage;
