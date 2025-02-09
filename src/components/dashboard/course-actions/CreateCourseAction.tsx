
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CreateCourseActionProps {
  onSuccess: () => void;
}

export const CreateCourseAction = ({ onSuccess }: CreateCourseActionProps) => {
  const { toast } = useToast();

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

      onSuccess();
    } catch (error) {
      console.error('Error creating course:', error);
      toast({
        title: "Error",
        description: "Failed to create course",
        variant: "destructive",
      });
    }
  };

  return handleCreateCourse;
};
