import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DashboardStats } from "./dashboard/DashboardStats";
import { EnrollmentTable } from "./dashboard/EnrollmentTable";
import { ProfessorCourses } from "./dashboard/ProfessorCourses";

export const ProfessorDashboard = () => {
  const { toast } = useToast();
  const [courses, setCourses] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [professorId, setProfessorId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfessorData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: professorData, error: professorError } = await supabase
          .from('professors')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (professorError) {
          console.error('Error fetching professor:', professorError);
          toast({
            title: "Error",
            description: "Failed to load professor data",
            variant: "destructive",
          });
          return;
        }

        if (professorData) {
          setProfessorId(professorData.id);
          fetchCourses(professorData.id);
        }
      }
    };

    fetchProfessorData();
  }, [toast]);

  const fetchCourses = async (profId: string) => {
    const { data: coursesData, error: coursesError } = await supabase
      .from('courses')
      .select(`
        *,
        enrollments (
          id,
          student:students (
            id,
            name,
            index_number
          )
        )
      `)
      .eq('professor_id', profId);

    if (coursesError) {
      console.error('Error fetching courses:', coursesError);
      toast({
        title: "Error",
        description: "Failed to load courses",
        variant: "destructive",
      });
      return;
    }

    if (coursesData) {
      setCourses(coursesData);
      const allEnrollments = coursesData.flatMap((course: any) => 
        course.enrollments.map((enrollment: any) => ({
          ...enrollment,
          course_title: course.title,
          course_id: course.id,
          student: enrollment.student
        }))
      );
      setEnrollments(allEnrollments);
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
          onCourseUpdated={() => fetchCourses(professorId!)}
        />

        <Card>
          <CardHeader>
            <CardTitle>Course Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <EnrollmentTable 
              enrollments={enrollments}
              isAdmin={false}
              onDeleteCourse={async (courseId) => {
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

                  fetchCourses(professorId!);
                } catch (error) {
                  console.error('Error deleting course:', error);
                  toast({
                    title: "Error",
                    description: "Failed to delete course and related data",
                    variant: "destructive",
                  });
                }
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};