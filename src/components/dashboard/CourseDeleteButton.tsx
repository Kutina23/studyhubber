import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";

interface CourseDeleteButtonProps {
  courseId: number;
  onSuccess: () => void;
}

export const CourseDeleteButton = ({ courseId, onSuccess }: CourseDeleteButtonProps) => {
  const { toast } = useToast();

  const handleDelete = async () => {
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
        description: "Course and related data deleted successfully",
      });

      onSuccess();
    } catch (error) {
      console.error('Error deleting course:', error);
      toast({
        title: "Error",
        description: "Failed to delete course and related data",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
};