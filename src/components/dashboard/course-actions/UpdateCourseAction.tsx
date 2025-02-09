
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CourseData {
  title: string;
  description: string;
  duration: string;
  schedule: string;
  instructor: string;
}

interface UpdateCourseActionProps {
  courseId: number;
  onSuccess: () => void;
}

export const UpdateCourseAction = ({ courseId, onSuccess }: UpdateCourseActionProps) => {
  const { toast } = useToast();

  const handleUpdateCourse = async (courseData: CourseData) => {
    try {
      const { error } = await supabase
        .from('courses')
        .update({
          ...courseData,
          duration: parseInt(courseData.duration)
        })
        .eq('id', courseId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Course updated successfully",
      });

      onSuccess();
    } catch (error) {
      console.error('Error updating course:', error);
      toast({
        title: "Error",
        description: "Failed to update course",
        variant: "destructive",
      });
    }
  };

  return handleUpdateCourse;
};
