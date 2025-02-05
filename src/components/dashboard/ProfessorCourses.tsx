import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CourseForm } from "@/components/course/CourseForm";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Course {
  id: number;
  title: string;
  description: string;
  duration: string;
  schedule: string;
  instructor: string;
}

interface ProfessorCoursesProps {
  courses: Course[];
  onCourseUpdated: () => void;
}

export const ProfessorCourses = ({ courses, onCourseUpdated }: ProfessorCoursesProps) => {
  const { toast } = useToast();
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const handleDeleteCourse = async (courseId: number) => {
    try {
      const { error: enrollmentError } = await supabase
        .from('enrollments')
        .delete()
        .eq('course_id', courseId);

      if (enrollmentError) throw enrollmentError;

      const { error: materialsError } = await supabase
        .from('course_materials')
        .delete()
        .eq('course_id', courseId);

      if (materialsError) throw materialsError;

      const { error: courseError } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (courseError) throw courseError;

      toast({
        title: "Success",
        description: "Course deleted successfully",
      });

      onCourseUpdated();
    } catch (error) {
      console.error('Error deleting course:', error);
      toast({
        title: "Error",
        description: "Failed to delete course",
        variant: "destructive",
      });
    }
  };

  const handleUpdateCourse = async (courseData: Partial<Course>) => {
    if (!editingCourse) return;

    try {
      const { error } = await supabase
        .from('courses')
        .update(courseData)
        .eq('id', editingCourse.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Course updated successfully",
      });

      setEditingCourse(null);
      onCourseUpdated();
    } catch (error) {
      console.error('Error updating course:', error);
      toast({
        title: "Error",
        description: "Failed to update course",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Courses</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Duration (weeks)</TableHead>
              <TableHead>Schedule</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell>{course.title}</TableCell>
                <TableCell>{course.duration}</TableCell>
                <TableCell>{course.schedule}</TableCell>
                <TableCell className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingCourse(course)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteCourse(course.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={!!editingCourse} onOpenChange={() => setEditingCourse(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Course</DialogTitle>
            </DialogHeader>
            {editingCourse && (
              <CourseForm
                data={{
                  title: editingCourse.title,
                  description: editingCourse.description,
                  duration: editingCourse.duration,
                  schedule: editingCourse.schedule,
                  instructor: editingCourse.instructor,
                }}
                onChange={(field, value) => {
                  handleUpdateCourse({ ...editingCourse, [field]: value });
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};