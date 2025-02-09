
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DeleteCourseActionProps {
  courseId: number;
  onSuccess: () => void;
}

export const DeleteCourseAction = ({ courseId, onSuccess }: DeleteCourseActionProps) => {
  const { toast } = useToast();

  const handleDeleteCourse = async () => {
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

      onSuccess();
    } catch (error) {
      console.error('Error deleting course:', error);
      toast({
        title: "Error",
        description: "Failed to delete course",
        variant: "destructive",
      });
    }
  };

  return handleDeleteCourse;
};
