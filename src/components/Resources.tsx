
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { CourseMaterialsList } from "./resources/CourseMaterialsList";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

export const Resources = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [courseMaterials, setCourseMaterials] = useState<any[]>([]);
  const [courseVideos, setCourseVideos] = useState<any[]>([]);
  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<number[]>([]);

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast({
            title: "Authentication Required",
            description: "Please log in to access course materials",
            variant: "destructive",
          });
          navigate('/login');
          return;
        }

        const { data: profile, error } = await supabase
          .from('students')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching student profile:', error);
          toast({
            title: "Error",
            description: "Failed to fetch your student profile",
            variant: "destructive",
          });
          return;
        }

        setStudentProfile(profile);
        
        if (!profile) {
          toast({
            title: "Student Profile Required",
            description: "Please create your student profile to access course materials",
          });
          navigate('/dashboard');
          return;
        }

        // Fetch enrolled courses
        const { data: enrollments, error: enrollmentsError } = await supabase
          .from('enrollments')
          .select('course_id')
          .eq('student_id', profile.id)
          .eq('status', 'active');

        if (enrollmentsError) {
          console.error('Error fetching enrollments:', enrollmentsError);
          return;
        }

        const courseIds = enrollments?.map(e => e.course_id) || [];
        setEnrolledCourses(courseIds);

        if (courseIds.length === 0) {
          setLoading(false);
          return;
        }

        // Fetch course materials
        const { data: materials, error: materialsError } = await supabase
          .from('course_materials')
          .select(`
            *,
            courses:course_id (
              title
            )
          `)
          .in('course_id', courseIds);

        if (materialsError) {
          console.error('Error fetching materials:', materialsError);
          return;
        }

        setCourseMaterials(materials || []);

        // Fetch course videos
        const { data: videos, error: videosError } = await supabase
          .from('course_videos')
          .select(`
            *,
            courses:course_id (
              title
            )
          `)
          .in('course_id', courseIds);

        if (videosError) {
          console.error('Error fetching videos:', videosError);
          return;
        }

        setCourseVideos(videos || []);
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStudentProfile();
  }, [toast, navigate]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[200px] w-full" />
        </div>
      </div>
    );
  }

  if (!studentProfile) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Student Profile Required</h2>
          <p className="mt-2 text-gray-600">Please create your student profile to access course materials</p>
          <Button
            onClick={() => navigate('/dashboard')}
            className="mt-4"
          >
            Create Profile
          </Button>
        </div>
      </div>
    );
  }

  if (enrolledCourses.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">No Enrolled Courses</h2>
          <p className="mt-2 text-gray-600">You need to enroll in courses to access their materials</p>
          <Button
            onClick={() => navigate('/courses')}
            className="mt-4"
          >
            Browse Courses
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Learning Resources</h1>
      </div>

      <div className="space-y-6">
        <CourseMaterialsList 
          materials={[...courseMaterials, ...courseVideos]}
          loading={loading}
          studentProfile={studentProfile}
        />
      </div>
    </div>
  );
};
