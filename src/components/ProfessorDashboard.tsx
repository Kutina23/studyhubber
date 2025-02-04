import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Book, Users, Video, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CourseCreationForm } from "./admin/CourseCreationForm";
import { Button } from "./ui/button";

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
        // Check if user is admin
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
          student_name: enrollment.student?.name,
          student_id: enrollment.student?.index_number
        }))
      );
      setEnrollments(allEnrollments);
    }
  };

  const handleDeleteCourse = async (courseId: number) => {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', courseId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete course",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Course deleted successfully",
    });

    // Refresh courses
    fetchCourses(professorId, isAdmin);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Professor Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <Book className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enrollments.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Course Videos</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <CourseCreationForm onCourseCreated={() => fetchCourses(professorId, isAdmin)} />

        <Card>
          <CardHeader>
            <CardTitle>Course Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Student ID</TableHead>
                  {isAdmin && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrollments.map((enrollment) => (
                  <TableRow key={enrollment.id}>
                    <TableCell>{enrollment.course_title}</TableCell>
                    <TableCell>{enrollment.student_name}</TableCell>
                    <TableCell>{enrollment.student_id}</TableCell>
                    {isAdmin && (
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteCourse(enrollment.course_id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};