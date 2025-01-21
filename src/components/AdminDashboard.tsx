import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Book, FileText, Bell, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/components/auth/AuthProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Course {
  title: string;
  instructor: string;
  schedule: string;
  duration: string;
  description: string;
}

interface Resource {
  name: string;
  type: string;
  url: string;
}

interface Announcement {
  title: string;
  content: string;
}

export const AdminDashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [newCourse, setNewCourse] = useState<Course>({
    title: "",
    instructor: "",
    schedule: "",
    duration: "",
    description: "",
  });

  const [newResource, setNewResource] = useState<Resource>({
    name: "",
    type: "document",
    url: "",
  });

  const [newAnnouncement, setNewAnnouncement] = useState<Announcement>({
    title: "",
    content: "",
  });

  // Check admin status
  const { data: isAdmin, isLoading: checkingAdmin, error: adminError } = useQuery({
    queryKey: ['adminStatus', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user?.id)
        .single();
        
      if (error) throw error;
      return data?.role === 'admin';
    },
    enabled: !!user?.id,
  });

  // Mutations
  const addCourseMutation = useMutation({
    mutationFn: async (courseData: Course) => {
      const { error } = await supabase
        .from('courses')
        .insert([{ ...courseData, duration: parseInt(courseData.duration) || 0 }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast({ title: "Success", description: "Course added successfully" });
      setNewCourse({
        title: "",
        instructor: "",
        schedule: "",
        duration: "",
        description: "",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const addResourceMutation = useMutation({
    mutationFn: async (resourceData: Resource) => {
      const { error } = await supabase
        .from('resources')
        .insert([resourceData]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      toast({ title: "Success", description: "Resource added successfully" });
      setNewResource({
        name: "",
        type: "document",
        url: "",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const addAnnouncementMutation = useMutation({
    mutationFn: async (announcementData: Announcement) => {
      const { error } = await supabase
        .from('announcements')
        .insert([announcementData]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      toast({ title: "Success", description: "Announcement added successfully" });
      setNewAnnouncement({
        title: "",
        content: "",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (checkingAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (adminError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <Alert variant="destructive">
          <AlertDescription>
            An error occurred while checking admin access. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <Alert>
          <AlertDescription>
            You don't have permission to access this page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
      
      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
        </TabsList>

        <TabsContent value="courses">
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Book className="w-5 h-5 text-primary mr-2" />
              <h2 className="text-xl font-semibold">Manage Courses</h2>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full">Add New Course</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Course</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Course Title"
                    value={newCourse.title}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, title: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Instructor"
                    value={newCourse.instructor}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, instructor: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Schedule"
                    value={newCourse.schedule}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, schedule: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Duration (hours)"
                    type="number"
                    value={newCourse.duration}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, duration: e.target.value })
                    }
                  />
                  <Textarea
                    placeholder="Description"
                    value={newCourse.description}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, description: e.target.value })
                    }
                  />
                  <Button 
                    onClick={() => addCourseMutation.mutate(newCourse)}
                    disabled={addCourseMutation.isPending}
                  >
                    {addCourseMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Add Course
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </Card>
        </TabsContent>

        <TabsContent value="resources">
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <FileText className="w-5 h-5 text-primary mr-2" />
              <h2 className="text-xl font-semibold">Manage Resources</h2>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full">Add New Resource</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Resource</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Resource Name"
                    value={newResource.name}
                    onChange={(e) =>
                      setNewResource({ ...newResource, name: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Resource URL"
                    value={newResource.url}
                    onChange={(e) =>
                      setNewResource({ ...newResource, url: e.target.value })
                    }
                  />
                  <Button 
                    onClick={() => addResourceMutation.mutate(newResource)}
                    disabled={addResourceMutation.isPending}
                  >
                    {addResourceMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Add Resource
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </Card>
        </TabsContent>

        <TabsContent value="announcements">
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Bell className="w-5 h-5 text-primary mr-2" />
              <h2 className="text-xl font-semibold">Manage Announcements</h2>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full">Add New Announcement</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Announcement</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Announcement Title"
                    value={newAnnouncement.title}
                    onChange={(e) =>
                      setNewAnnouncement({
                        ...newAnnouncement,
                        title: e.target.value,
                      })
                    }
                  />
                  <Textarea
                    placeholder="Announcement Content"
                    value={newAnnouncement.content}
                    onChange={(e) =>
                      setNewAnnouncement({
                        ...newAnnouncement,
                        content: e.target.value,
                      })
                    }
                  />
                  <Button 
                    onClick={() => addAnnouncementMutation.mutate(newAnnouncement)}
                    disabled={addAnnouncementMutation.isPending}
                  >
                    {addAnnouncementMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Add Announcement
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};