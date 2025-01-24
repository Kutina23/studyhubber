import { Card } from "@/components/ui/card";
import { MessageSquare, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { ForumGroup, Group } from "./ForumGroup";

type FormValues = {
  name: string;
  description: string;
};

export const Forum = () => {
  const { toast } = useToast();
  const [groups, setGroups] = useState<Group[]>([
    {
      id: 1,
      name: "Study Group A",
      description: "General study group for Computer Science students",
      createdBy: "John Doe",
      createdAt: "2024-01-24",
      members: [
        { id: 1, name: "John Doe", joinedAt: "2024-01-24" }
      ],
      discussions: [
        {
          id: 1,
          title: "First Meeting Schedule",
          content: "When should we schedule our first meeting?",
          author: "John Doe",
          createdAt: "2024-01-24",
          replies: []
        }
      ]
    }
  ]);

  const form = useForm<FormValues>({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    const newGroup: Group = {
      id: groups.length + 1,
      name: data.name,
      description: data.description,
      createdBy: "Current User",
      createdAt: new Date().toISOString().split('T')[0],
      members: [
        { id: 1, name: "Current User", joinedAt: new Date().toISOString().split('T')[0] }
      ],
      discussions: []
    };

    setGroups([newGroup, ...groups]);
    form.reset();
    toast({
      title: "Group Created",
      description: "Your study group has been successfully created.",
    });
  };

  const handleJoinGroup = (groupId: number) => {
    setGroups(groups.map(group => {
      if (group.id === groupId && !group.members.some(m => m.name === "Current User")) {
        return {
          ...group,
          members: [...group.members, {
            id: group.members.length + 1,
            name: "Current User",
            joinedAt: new Date().toISOString().split('T')[0]
          }]
        };
      }
      return group;
    }));

    toast({
      title: "Joined Group",
      description: "You have successfully joined the group.",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Study Groups</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Group
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Study Group</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Group Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter group name" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the purpose of your group..."
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Create Group
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        {groups.map((group) => (
          <ForumGroup 
            key={group.id} 
            group={group} 
            onJoinGroup={handleJoinGroup}
          />
        ))}
      </div>
    </div>
  );
};