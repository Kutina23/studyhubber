
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useProfessorData = () => {
  const { toast } = useToast();
  const [courses, setCourses] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [professorId, setProfessorId] = useState<string | null>(null);

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
      .eq('professor_id', profId)
      .order('created_at', { ascending: false });

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

  return {
    courses,
    enrollments,
    professorId,
    refreshCourses: () => professorId && fetchCourses(professorId),
  };
};
