
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateCourseDialog } from "@/components/CreateCourseDialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CoursesTable } from "./CoursesTable";
import { EditCourseDialog } from "./EditCourseDialog";

interface Course {
  id: number;
  title: string;
  description: string;
  duration: number;
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

  const handleUpdateCourse = async (courseData: {
    title: string;
    description: string;
    duration: string;
    schedule: string;
    instructor: string;
  }) => {
    if (!editingCourse) return;

    try {
      const { error } = await supabase
        .from('courses')
        .update({
          ...courseData,
          duration: parseInt(courseData.duration)
        })
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

  const handleCreateCourse = async (courseData: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: professorData, error: professorError } = await supabase
        .from('professors')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (professorError) throw professorError;

      const { error } = await supabase
        .from('courses')
        .insert({
          ...courseData,
          duration: parseInt(courseData.duration),
          professor_id: professorData.id
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Course created successfully",
      });

      onCourseUpdated();
    } catch (error) {
      console.error('Error creating course:', error);
      toast({
        title: "Error",
        description: "Failed to create course",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>My Courses</CardTitle>
        <CreateCourseDialog onCreateCourse={handleCreateCourse} />
      </CardHeader>
      <CardContent>
        <CoursesTable
          courses={courses}
          onEditCourse={setEditingCourse}
          onDeleteCourse={handleDeleteCourse}
          onCourseUpdated={onCourseUpdated}
        />
        
        <EditCourseDialog
          course={editingCourse}
          onClose={() => setEditingCourse(null)}
          onUpdate={handleUpdateCourse}
        />
      </CardContent>
    </Card>
  );
};
