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

type Discussion = {
  id: number;
  title: string;
  author: string;
  replies: number;
  lastActivity: string;
};

type FormValues = {
  title: string;
  content: string;
};

export const Forum = () => {
  const { toast } = useToast();
  const [discussions, setDiscussions] = useState<Discussion[]>([
    {
      id: 1,
      title: "Tips for Final Exams",
      author: "Sarah Johnson",
      replies: 15,
      lastActivity: "2024-01-20",
    },
    {
      id: 2,
      title: "Study Group for Computer Science",
      author: "Mike Chen",
      replies: 8,
      lastActivity: "2024-01-19",
    },
    {
      id: 3,
      title: "Research Paper Guidelines",
      author: "Prof. Williams",
      replies: 23,
      lastActivity: "2024-01-18",
    },
  ]);

  const form = useForm<FormValues>({
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    const newDiscussion: Discussion = {
      id: discussions.length + 1,
      title: data.title,
      author: "Current User", // In a real app, this would come from auth
      replies: 0,
      lastActivity: new Date().toISOString().split('T')[0],
    };

    setDiscussions([newDiscussion, ...discussions]);
    form.reset();
    toast({
      title: "Discussion Created",
      description: "Your discussion has been successfully created.",
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
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <MessageSquare className="w-4 h-4 mr-1" />
                {discussion.replies} replies
              </div>
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