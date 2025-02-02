import { Card } from "@/components/ui/card";
import { MessageSquare, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { ForumGroup, Group } from "./ForumGroup";
import { supabase } from "@/integrations/supabase/client";

type FormValues = {
  name: string;
  description: string;
};

export const Forum = () => {
  const { toast } = useToast();
  const [groups, setGroups] = useState<Group[]>([]);
  const [currentUser, setCurrentUser] = useState<string>("");
  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: student, error } = await supabase
            .from('students')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

          if (error) {
            console.error('Error fetching student:', error);
            toast({
              title: "Error",
              description: "Failed to fetch student profile",
              variant: "destructive",
            });
            return;
          }

          if (student) {
            setCurrentUser(student.name);
            setStudentProfile(student);
          }
        }
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: "Failed to fetch user data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    const savedGroups = localStorage.getItem('forumGroups');
    if (savedGroups) {
      setGroups(JSON.parse(savedGroups));
    }
  }, [toast]);

  useEffect(() => {
    localStorage.setItem('forumGroups', JSON.stringify(groups));
  }, [groups]);

  const form = useForm<FormValues>({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    if (!studentProfile) {
      toast({
        title: "Error",
        description: "You need to create a student profile first",
        variant: "destructive",
      });
      return;
    }

    const newGroup: Group = {
      id: Date.now(),
      name: data.name,
      description: data.description,
      createdBy: currentUser,
      createdAt: new Date().toISOString().split('T')[0],
      members: [
        { id: 1, name: currentUser, joinedAt: new Date().toISOString().split('T')[0] }
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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="flex items-center justify-center min-h-[200px]">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Study Groups</h1>
        {studentProfile && (
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
        )}
      </div>

      {!studentProfile && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
          <p className="text-yellow-700">
            Please create your student profile with your index number to participate in study groups.
          </p>
        </div>
      )}

      <div className="space-y-6">
        {groups.map((group) => (
          <ForumGroup 
            key={group.id} 
            group={group} 
            onJoinGroup={handleJoinGroup}
            onDeleteGroup={handleDeleteGroup}
            onUpdateGroup={handleUpdateGroup}
            currentUser={currentUser}
          />
        ))}
      </div>
    </div>
  );
};