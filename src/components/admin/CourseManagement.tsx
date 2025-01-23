import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Book, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Course {
  title: string;
  instructor: string;
  schedule: string;
  duration: string;
  description: string;
}

export const CourseManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [newCourse, setNewCourse] = useState<Course>({
    title: "",
    instructor: "",
    schedule: "",
    duration: "",
    description: "",
  });

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

  return (
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
  );
};