import type { Post } from "../types/post.types";
import { Avatar, AvatarFallback, AvatarImage } from "../../../shared/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "../../../shared/components/ui/card";
import { Heart, MessageCircle, Send } from "lucide-react";
import { Button } from "../../../shared/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface PostCardProps {
    post: Post;
}

export function PostCard({ post }: PostCardProps) {
    return (
        <Card className="w-full max-w-md mx-auto mb-4 border-none shadow-sm">
            <CardHeader className="flex flex-row items-center gap-3 p-4">
                <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarImage src={post.pet?.image} alt={post.pet?.name} />
                    <AvatarFallback>{post.pet?.name?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="font-semibold text-sm cursor-pointer hover:underline">
                        {post.pet?.username || post.pet?.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: tr })}
                    </span>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="relative aspect-square w-full bg-muted">
                    <img
                        src={post.image_url}
                        alt="Post"
                        className="object-cover w-full h-full"
                        loading="lazy"
                    />
                </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start p-4 gap-3">
                <div className="flex w-full gap-4">
                    <Button variant="ghost" size="icon" className="hover:text-red-500">
                        <Heart className="h-6 w-6" />
                    </Button>
                    <Button variant="ghost" size="icon">
                        <MessageCircle className="h-6 w-6" />
                    </Button>
                    <Button variant="ghost" size="icon" className="ml-auto">
                        <Send className="h-6 w-6" />
                    </Button>
                </div>
                {post.description && (
                    <div className="text-sm">
                        <span className="font-semibold mr-2">{post.pet?.username || post.pet?.name}</span>
                        {post.description}
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}
