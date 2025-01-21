import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Book, FileText, Bell, Upload, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const AdminDashboard = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newCourse, setNewCourse] = useState({
    title: "",
    instructor: "",
    schedule: "",
    duration: "",
    description: "",
  });

  const [newResource, setNewResource] = useState({
    name: "",
    type: "document",
    url: "",
  });

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
  });

  // Query to check admin status
  const { data: isAdmin, isLoading: checkingAdmin } = useQuery({
    queryKey: ['adminStatus'],
    queryFn: async () => {
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .single();
      return roles?.role === 'admin';
    },
  });

  // Mutations for adding data
  const addCourseMutation = useMutation({
    mutationFn: async (courseData: typeof newCourse) => {
      const { error } = await supabase
        .from('courses')
        .insert([{ ...courseData, duration: parseInt(courseData.duration) || 0 }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast({
        title: "Success",
        description: "Course added successfully",
      });
      setNewCourse({
        title: "",
        instructor: "",
        schedule: "",
        duration: "",
        description: "",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const addResourceMutation = useMutation({
    mutationFn: async (resourceData: typeof newResource) => {
      const { error } = await supabase
        .from('resources')
        .insert([resourceData]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      toast({
        title: "Success",
        description: "Resource added successfully",
      });
      setNewResource({
        name: "",
        type: "document",
        url: "",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const addAnnouncementMutation = useMutation({
    mutationFn: async (announcementData: typeof newAnnouncement) => {
      const { error } = await supabase
        .from('announcements')
        .insert([announcementData]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      toast({
        title: "Success",
        description: "Announcement added successfully",
      });
      setNewAnnouncement({
        title: "",
        content: "",
      });
    },
    onError: (error) => {
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

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const handleAddCourse = () => {
    if (!newCourse.title || !newCourse.instructor) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    addCourseMutation.mutate(newCourse);
  };

  const handleAddResource = () => {
    if (!newResource.name || !newResource.url) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    addResourceMutation.mutate(newResource);
  };

  const handleAddAnnouncement = () => {
    if (!newAnnouncement.title || !newAnnouncement.content) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    addAnnouncementMutation.mutate(newAnnouncement);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Courses Management */}
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <Book className="w-5 h-5 text-primary mr-2" />
            <h2 className="text-xl font-semibold">Manage Courses</h2>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full" disabled={addCourseMutation.isPending}>
                {addCourseMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Add New Course
              </Button>
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
                  onClick={handleAddCourse}
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

        {/* Resources Management */}
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <FileText className="w-5 h-5 text-primary mr-2" />
            <h2 className="text-xl font-semibold">Manage Resources</h2>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full" disabled={addResourceMutation.isPending}>
                {addResourceMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Add New Resource
              </Button>
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
                  onClick={handleAddResource}
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

        {/* Announcements Management */}
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <Bell className="w-5 h-5 text-primary mr-2" />
            <h2 className="text-xl font-semibold">Manage Announcements</h2>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full" disabled={addAnnouncementMutation.isPending}>
                {addAnnouncementMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Add New Announcement
              </Button>
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
                  onClick={handleAddAnnouncement}
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
      </div>
    </div>
  );
};