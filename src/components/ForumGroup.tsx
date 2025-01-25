import { Card } from "@/components/ui/card";
import { MessageSquare, Plus, Users, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";

export type GroupMember = {
  id: number;
  name: string;
  joinedAt: string;
};

export type GroupDiscussion = {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  replies: {
    id: number;
    content: string;
    author: string;
    createdAt: string;
  }[];
};

export type Group = {
  id: number;
  name: string;
  description: string;
  createdBy: string;
  createdAt: string;
  members: GroupMember[];
  discussions: GroupDiscussion[];
};

type GroupFormValues = {
  name: string;
  description: string;
};

type DiscussionFormValues = {
  title: string;
  content: string;
};

type ReplyFormValues = {
  content: string;
};

export const ForumGroup = ({ 
  group, 
  onJoinGroup, 
  onDeleteGroup,
  onUpdateGroup 
}: { 
  group: Group; 
  onJoinGroup: (groupId: number) => void;
  onDeleteGroup: (groupId: number) => void;
  onUpdateGroup: (group: Group) => void;
}) => {
  const { toast } = useToast();
  const [selectedDiscussion, setSelectedDiscussion] = useState<GroupDiscussion | null>(null);
  
  const discussionForm = useForm<DiscussionFormValues>({
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const replyForm = useForm<ReplyFormValues>({
    defaultValues: {
      content: "",
    },
  });

  const onDiscussionSubmit = (data: DiscussionFormValues) => {
    const newDiscussion: GroupDiscussion = {
      id: group.discussions.length + 1,
      title: data.title,
      content: data.content,
      author: "Current User",
      createdAt: new Date().toISOString().split('T')[0],
      replies: []
    };

    const updatedGroup = {
      ...group,
      discussions: [newDiscussion, ...group.discussions]
    };
    
    onUpdateGroup(updatedGroup);
    toast({
      title: "Discussion Created",
      description: "Your discussion has been added to the group.",
    });
    discussionForm.reset();
  };

  const onReplySubmit = (data: ReplyFormValues) => {
    if (!selectedDiscussion) return;
    
    const updatedDiscussions = group.discussions.map(discussion => {
      if (discussion.id === selectedDiscussion.id) {
        return {
          ...discussion,
          replies: [...discussion.replies, {
            id: discussion.replies.length + 1,
            content: data.content,
            author: "Current User",
            createdAt: new Date().toISOString().split('T')[0]
          }]
        };
      }
      return discussion;
    });

    onUpdateGroup({
      ...group,
      discussions: updatedDiscussions
    });

    toast({
      title: "Reply Added",
      description: "Your reply has been added to the discussion.",
    });
    replyForm.reset();
    setSelectedDiscussion(null);
  };

  const handleDeleteDiscussion = (discussionId: number) => {
    const updatedDiscussions = group.discussions.filter(
      discussion => discussion.id !== discussionId
    );

    onUpdateGroup({
      ...group,
      discussions: updatedDiscussions
    });

    toast({
      title: "Discussion Deleted",
      description: "The discussion has been removed from the group.",
    });
  };

  return (
    <Card className="p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold">{group.name}</h2>
          <p className="text-sm text-gray-500">{group.description}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center text-sm text-gray-500">
            <Users className="w-4 h-4 mr-1" />
            {group.members.length} members
          </div>
          <Button onClick={() => onJoinGroup(group.id)}>
            Join Group
          </Button>
          {group.createdBy === "Current User" && (
            <Button 
              variant="destructive" 
              size="icon"
              onClick={() => onDeleteGroup(group.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Discussions</h3>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Discussion
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Discussion</DialogTitle>
              </DialogHeader>
              <Form {...discussionForm}>
                <form onSubmit={discussionForm.handleSubmit(onDiscussionSubmit)} className="space-y-4">
                  <FormField
                    control={discussionForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter discussion title" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={discussionForm.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Write your discussion content here..."
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    Create Discussion
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {group.discussions.map((discussion) => (
            <Card key={discussion.id} className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium">{discussion.title}</h4>
                  <p className="text-sm text-gray-500">
                    by {discussion.author} on {discussion.createdAt}
                  </p>
                  <p className="mt-2">{discussion.content}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    {discussion.replies.length} replies
                  </div>
                  {discussion.author === "Current User" && (
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteDiscussion(discussion.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {discussion.replies.length > 0 && (
                <div className="mt-4 space-y-3">
                  {discussion.replies.map((reply) => (
                    <div key={reply.id} className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm">{reply.content}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {reply.author} - {reply.createdAt}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4">
                <Dialog open={selectedDiscussion?.id === discussion.id} 
                       onOpenChange={(open) => !open && setSelectedDiscussion(null)}>
                  <DialogTrigger asChild>
                    <Button variant="outline" onClick={() => setSelectedDiscussion(discussion)}>
                      Reply
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Reply to Discussion</DialogTitle>
                    </DialogHeader>
                    <Form {...replyForm}>
                      <form onSubmit={replyForm.handleSubmit(onReplySubmit)} className="space-y-4">
                        <FormField
                          control={replyForm.control}
                          name="content"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Your Reply</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Write your reply here..."
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full">
                          Submit Reply
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Card>
  );
};