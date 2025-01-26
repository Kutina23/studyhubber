import { Card } from "@/components/ui/card";
import { Book, Clock, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const Courses = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState<number[]>([]);
  const [studentId, setStudentId] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: studentData } = await supabase
          .from('students')
          .select('id')
          .eq('user_id', user.id)
          .single();
        
        if (studentData) {
          setStudentId(studentData.id);
          // Fetch enrolled courses
          const { data: enrollments } = await supabase
            .from('enrollments')
            .select('course_id')
            .eq('student_id', studentData.id);
          
          if (enrollments) {
            setEnrolledCourses(enrollments.map(e => e.course_id));
          }
        }
      }
    };

    fetchStudentData();
  }, []);

  const courses = [
    {
      id: 1,
      title: "Introduction to Computer Science",
      instructor: "Dr. Sarah Smith",
      schedule: "Mon, Wed 10:00 AM",
      enrolled: 45,
      duration: "16 weeks",
      description:
        "A comprehensive introduction to computer science fundamentals, covering programming basics, algorithms, and data structures.",
    },
    {
      id: 2,
      title: "Advanced Mathematics",
      instructor: "Prof. Michael Johnson",
      schedule: "Tue, Thu 2:00 PM",
      enrolled: 32,
      duration: "16 weeks",
      description:
        "Advanced mathematical concepts including calculus, linear algebra, and probability theory.",
    },
    {
      id: 3,
      title: "Digital Marketing Fundamentals",
      instructor: "Prof. Emily Chen",
      schedule: "Wed, Fri 1:00 PM",
      enrolled: 38,
      duration: "12 weeks",
      description:
        "Learn the basics of digital marketing, including social media strategy, SEO, and content marketing.",
    },
  ];

  const handleEnroll = async (courseId: number, courseTitle: string) => {
    if (!studentId) {
      toast({
        title: "Authentication Required",
        description: "Please log in with your student index number first",
        variant: "destructive",
      });
      return;
    }

    if (enrolledCourses.includes(courseId)) {
      // Navigate to course resources
      navigate(`/course-resources/${courseId}`);
    } else {
      try {
        // Create enrollment
        const { error } = await supabase
          .from('enrollments')
          .insert({
            course_id: courseId,
            student_id: studentId,
          });

        if (error) throw error;

        setEnrolledCourses([...enrolledCourses, courseId]);
        toast({
          title: "Course Enrolled",
          description: `You have successfully enrolled in ${courseTitle}`,
          variant: "default",
        });
        
        // Navigate to course resources
        navigate(`/course-resources/${courseId}`);
      } catch (error) {
        toast({
          title: "Enrollment Failed",
          description: "There was an error enrolling in the course. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Available Courses</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="p-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {course.title}
            </h2>
            <p className="text-sm text-gray-500 mt-2">{course.description}</p>

            <div className="mt-4 space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Book className="w-4 h-4 mr-2" />
                Instructor: {course.instructor}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule: {course.schedule}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                Duration: {course.duration}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-2" />
                {course.enrolled + (enrolledCourses.includes(course.id) ? 1 : 0)}{" "}
                students enrolled
              </div>
            </div>

            <div className="mt-6">
              <Button
                className="w-full"
                variant={enrolledCourses.includes(course.id) ? "secondary" : "default"}
                onClick={() => handleEnroll(course.id, course.title)}
              >
                {enrolledCourses.includes(course.id) ? "View Course" : "Enroll Now"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};