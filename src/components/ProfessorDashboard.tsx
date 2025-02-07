
import { DashboardStats } from "./dashboard/DashboardStats";
import { ProfessorCourses } from "./dashboard/ProfessorCourses";
import { ProfessorEnrollments } from "./dashboard/ProfessorEnrollments";
import { useProfessorData } from "@/hooks/useProfessorData";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const ProfessorDashboard = () => {
  const { toast } = useToast();
  const { courses, enrollments, professorId, refreshCourses } = useProfessorData();

  const handleDeleteCourse = async (courseId: number) => {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Course and related data deleted successfully",
      });

      refreshCourses();
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
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Professor Dashboard</h1>
      
      <DashboardStats 
        coursesCount={courses.length}
        studentsCount={enrollments.length}
      />

      <div className="grid grid-cols-1 gap-6">
        <ProfessorCourses 
          courses={courses}
          onCourseUpdated={refreshCourses}
        />

        <ProfessorEnrollments 
          enrollments={enrollments}
          onDeleteCourse={handleDeleteCourse}
        />
      </div>
    </div>
  );
};
