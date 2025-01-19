import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Book, FileText, Bell, Upload } from "lucide-react";

export const AdminDashboard = () => {
  const { toast } = useToast();
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
    size: "",
  });

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
  });

  const handleAddCourse = () => {
    if (!newCourse.title || !newCourse.instructor) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

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
  };

  const handleAddResource = () => {
    if (!newResource.name) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Resource added successfully",
    });
    setNewResource({
      name: "",
      type: "document",
      size: "",
    });
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

    toast({
      title: "Success",
      description: "Announcement added successfully",
    });
    setNewAnnouncement({
      title: "",
      content: "",
    });
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
                  placeholder="Duration"
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
                <Button onClick={handleAddCourse}>Add Course</Button>
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
                <div className="flex items-center space-x-2">
                  <Upload className="w-5 h-5 text-gray-500" />
                  <span className="text-sm text-gray-500">Upload File</span>
                </div>
                <Button onClick={handleAddResource}>Add Resource</Button>
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
                <Button onClick={handleAddAnnouncement}>Add Announcement</Button>
              </div>
            </DialogContent>
          </Dialog>
        </Card>
      </div>
    </div>
  );
};