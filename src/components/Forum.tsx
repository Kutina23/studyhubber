import { Card } from "@/components/ui/card";
import { MessageSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";

type Reply = {
  id: number;
  content: string;
  author: string;
  createdAt: string;
};

type Discussion = {
  id: number;
  title: string;
  author: string;
  replies: Reply[];
  lastActivity: string;
  content?: string;
};

type FormValues = {
  title: string;
  content: string;
};

type ReplyFormValues = {
  content: string;
};

export const Forum = () => {
  const { toast } = useToast();
  const [selectedDiscussion, setSelectedDiscussion] = useState<Discussion | null>(null);
  const [discussions, setDiscussions] = useState<Discussion[]>([
    {
      id: 1,
      title: "Tips for Final Exams",
      author: "Sarah Johnson",
      content: "Here are some tips for preparing for final exams...",
      replies: [
        {
          id: 1,
          content: "Thanks for sharing these tips!",
          author: "John Doe",
          createdAt: "2024-01-21",
        }
      ],
      lastActivity: "2024-01-20",
    },
    {
      id: 2,
      title: "Study Group for Computer Science",
      author: "Mike Chen",
      content: "Looking for study partners for CS courses...",
      replies: [],
      lastActivity: "2024-01-19",
    },
    {
      id: 3,
      title: "Research Paper Guidelines",
      author: "Prof. Williams",
      content: "Important guidelines for your research papers...",
      replies: [],
      lastActivity: "2024-01-18",
    },
  ]);

  const form = useForm<FormValues>({
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

  const onSubmit = (data: FormValues) => {
    const newDiscussion: Discussion = {
      id: discussions.length + 1,
      title: data.title,
      content: data.content,
      author: "Current User",
      replies: [],
      lastActivity: new Date().toISOString().split('T')[0],
    };

    setDiscussions([newDiscussion, ...discussions]);
    form.reset();
    toast({
      title: "Discussion Created",
      description: "Your discussion has been successfully created.",
    });
  };

  const onReplySubmit = (data: ReplyFormValues) => {
    if (!selectedDiscussion) return;

    const newReply: Reply = {
      id: selectedDiscussion.replies.length + 1,
      content: data.content,
      author: "Current User",
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updatedDiscussions = discussions.map(discussion =>
      discussion.id === selectedDiscussion.id
        ? {
            ...discussion,
            replies: [...discussion.replies, newReply],
            lastActivity: new Date().toISOString().split('T')[0],
          }
        : discussion
    );

    setDiscussions(updatedDiscussions);
    replyForm.reset();
    setSelectedDiscussion(null);
    toast({
      title: "Reply Added",
      description: "Your reply has been successfully added to the discussion.",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Discussion Forum</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Discussion
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Discussion</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
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
                  control={form.control}
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
        {discussions.map((discussion) => (
          <Card key={discussion.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">
                  {discussion.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Started by {discussion.author}
                </p>
                <p className="text-sm text-gray-700 mt-2">
                  {discussion.content}
                </p>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <MessageSquare className="w-4 h-4 mr-1" />
                {discussion.replies.length} replies
              </div>
            </div>
            
            {discussion.replies.length > 0 && (
              <div className="mt-4 space-y-3">
                <h4 className="text-sm font-medium text-gray-900">Replies</h4>
                {discussion.replies.map((reply) => (
                  <div key={reply.id} className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-700">{reply.content}</p>
                    <div className="mt-2 text-xs text-gray-500">
                      {reply.author} - {reply.createdAt}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4">
              <Dialog open={selectedDiscussion?.id === discussion.id} onOpenChange={(open) => !open && setSelectedDiscussion(null)}>
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
            
            <div className="mt-4 text-xs text-gray-400">
              Last activity: {discussion.lastActivity}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};