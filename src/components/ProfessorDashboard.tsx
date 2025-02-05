import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DashboardStats } from "./dashboard/DashboardStats";
import { EnrollmentTable } from "./dashboard/EnrollmentTable";
import { CourseManagement } from "./dashboard/CourseManagement";

export const ProfessorDashboard = () => {
  const { toast } = useToast();
  const [courses, setCourses] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [professorId, setProfessorId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchProfessorData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: roles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);
        
        setIsAdmin(roles?.some(role => role.role === 'admin') || false);

        const { data: professorData, error: professorError } = await supabase
          .from('professors')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (professorError && !isAdmin) {
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
        }
        fetchCourses(professorData?.id, isAdmin);
      }
    };

    fetchProfessorData();
  }, [toast]);

  const fetchCourses = async (profId: string | null, isAdmin: boolean) => {
    let query = supabase
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
      `);

    if (!isAdmin && profId) {
      query = query.eq('professor_id', profId);
    }

    const { data: coursesData, error: coursesError } = await query;

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
          student_name: enrollment.student?.name,
          student_id: enrollment.student?.index_number
        }))
      );
      setEnrollments(allEnrollments);
    }
  };

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
        description: "Course and related data deleted successfully",
      });

      fetchCourses(professorId, isAdmin);
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
        <CourseManagement onCourseCreated={() => fetchCourses(professorId, isAdmin)} />

        <Card>
          <CardHeader>
            <CardTitle>Course Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <EnrollmentTable 
              enrollments={enrollments}
              isAdmin={isAdmin}
              onDeleteCourse={handleDeleteCourse}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};