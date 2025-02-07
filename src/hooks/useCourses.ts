
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useCourses = () => {
  const { toast } = useToast();
  const [courses, setCourses] = useState<any[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<number[]>([]);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: roles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);
        
        setIsAdmin(roles?.some(role => role.role === 'admin') || false);
      }
    };

    checkUserRole();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      const { data: coursesData, error } = await supabase
        .from('courses')
        .select('*');
      
      if (error) {
        console.error('Error fetching courses:', error);
        toast({
          title: "Error",
          description: "Failed to load courses. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (coursesData) {
        setCourses(coursesData);
      }
    };

    fetchCourses();
  }, [toast]);

  useEffect(() => {
    const fetchStudentData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: studentData, error } = await supabase
          .from('students')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (error) {
          console.error('Error fetching student data:', error);
          return;
        }
        
        if (studentData) {
          setStudentId(studentData.id);
          const { data: enrollments } = await supabase
            .from('enrollments')
            .select('course_id')
            .eq('student_id', studentData.id);
          
          if (enrollments) {
            setEnrolledCourses(enrollments.map(e => e.course_id));
          }
        } else {
          toast({
            title: "Student Profile Required",
            description: "Please create your student profile with your index number first",
            variant: "destructive",
          });
        }
      }
    };

    fetchStudentData();
  }, [toast]);

  const createCourse = async (courseData: any) => {
    try {
      const { error } = await supabase
        .from('courses')
        .insert({
          ...courseData,
          duration: parseInt(courseData.duration),
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Course created successfully",
      });

      // Refresh courses list
      const { data: coursesData } = await supabase
        .from('courses')
        .select('*');
      
      if (coursesData) {
        setCourses(coursesData);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create course. Please try again.",
        variant: "destructive",
      });
    }
  };

  const enrollInCourse = async (courseId: number, courseTitle: string) => {
    if (!studentId) {
      toast({
        title: "Student Profile Required",
        description: "Please create your student profile with your index number first",
        variant: "destructive",
      });
      return;
    }

    // First check if the student is already enrolled
    const { data: existingEnrollment } = await supabase
      .from('enrollments')
      .select('id')
      .eq('course_id', courseId)
      .eq('student_id', studentId)
      .maybeSingle();

    if (existingEnrollment) {
      toast({
        title: "Already Enrolled",
        description: `You are already enrolled in ${courseTitle}`,
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('enrollments')
        .insert({
          course_id: courseId,
          student_id: studentId,
        });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Already Enrolled",
            description: `You are already enrolled in ${courseTitle}`,
          });
          return;
        }
        throw error;
      }

      setEnrolledCourses([...enrolledCourses, courseId]);
      toast({
        title: "Success",
        description: `You have successfully enrolled in ${courseTitle}`,
      });
    } catch (error) {
      console.error('Enrollment error:', error);
      toast({
        title: "Enrollment Failed",
        description: "There was an error enrolling in the course. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    courses,
    enrolledCourses,
    isAdmin,
    createCourse,
    enrollInCourse,
  };
};
