import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

interface CreateCourseDialogProps {
  onCreateCourse: (courseData: {
    title: string;
    description: string;
    duration: string;
    schedule: string;
    instructor: string;
  }) => Promise<void>;
}

export const CreateCourseDialog = ({ onCreateCourse }: CreateCourseDialogProps) => {
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    duration: "",
    schedule: "",
    instructor: "",
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Course
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Course</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Course Title</Label>
            <Input
              id="title"
              value={newCourse.title}
              onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newCourse.description}
              onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="instructor">Instructor</Label>
            <Input
              id="instructor"
              value={newCourse.instructor}
              onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="duration">Duration (weeks)</Label>
            <Input
              id="duration"
              type="number"
              value={newCourse.duration}
              onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="schedule">Schedule</Label>
            <Input
              id="schedule"
              value={newCourse.schedule}
              onChange={(e) => setNewCourse({ ...newCourse, schedule: e.target.value })}
            />
          </div>
          <Button onClick={() => onCreateCourse(newCourse)}>Create Course</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};