import { Card } from "@/components/ui/card";
import { Book, Clock, Users, Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Courses = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState<number[]>([]);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    duration: "",
    schedule: "",
    instructor: "",
  });

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
          // Fetch enrolled courses
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

  const handleEnroll = async (courseId: number, courseTitle: string) => {
    if (!studentId) {
      toast({
        title: "Student Profile Required",
        description: "Please create your student profile with your index number first",
        variant: "destructive",
      });
      return;
    }

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
        title: "Success",
        description: `You have successfully enrolled in ${courseTitle}`,
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
  };

  const handleCreateCourse = async () => {
    try {
      const { error } = await supabase
        .from('courses')
        .insert({
          ...newCourse,
          duration: parseInt(newCourse.duration),
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

      // Reset form
      setNewCourse({
        title: "",
        description: "",
        duration: "",
        schedule: "",
        instructor: "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create course. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Available Courses</h1>
        {isAdmin && (
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Course
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Course</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Course Title</Label>
                  <Input
                    id="title"
                    value={newCourse.title}
                    onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="instructor">Instructor</Label>
                  <Input
                    id="instructor"
                    value={newCourse.instructor}
                    onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration (weeks)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={newCourse.duration}
                    onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="schedule">Schedule</Label>
                  <Input
                    id="schedule"
                    value={newCourse.schedule}
                    onChange={(e) => setNewCourse({ ...newCourse, schedule: e.target.value })}
                  />
                </div>
                <Button onClick={handleCreateCourse}>Create Course</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

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
                Duration: {course.duration} weeks
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-2" />
                {enrolledCourses.includes(course.id) ? "You're enrolled" : "Enroll now"}
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