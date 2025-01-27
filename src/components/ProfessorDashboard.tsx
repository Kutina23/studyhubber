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
import { Book, Users, Video, Plus, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const ProfessorDashboard = () => {
  const { toast } = useToast();
  const [courses, setCourses] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [professorId, setProfessorId] = useState<string | null>(null);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    duration: "",
    schedule: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [videoTitle, setVideoTitle] = useState("");

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
          fetchProfessorCourses(professorData.id);
        }
      }
    };

    fetchProfessorData();
  }, [toast]);

  const fetchProfessorCourses = async (profId: string) => {
    const { data: coursesData, error: coursesError } = await supabase
      .from('courses')
      .select(`
        *,
        enrollments (
          id,
          student:students (
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
          course_title: course.title
        }))
      );
      setEnrollments(allEnrollments);
    }
  };

  const handleCreateCourse = async () => {
    if (!professorId) return;

    const { data, error } = await supabase
      .from('courses')
      .insert({
        ...newCourse,
        instructor: professorId,
        professor_id: professorId,
        duration: parseInt(newCourse.duration),
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create course",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Course created successfully",
    });

    fetchProfessorCourses(professorId);
    setNewCourse({ title: "", description: "", duration: "", schedule: "" });
  };

  const handleFileUpload = async () => {
    if (!selectedFile || !selectedCourse || !videoTitle || !professorId) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const fileExt = selectedFile.name.split('.').pop();
    const filePath = `${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('course-videos')
      .upload(filePath, selectedFile);

    if (uploadError) {
      toast({
        title: "Error",
        description: "Failed to upload video",
        variant: "destructive",
      });
      return;
    }

    const { data: urlData } = supabase.storage
      .from('course-videos')
      .getPublicUrl(filePath);

    const { error: dbError } = await supabase
      .from('course_videos')
      .insert({
        course_id: selectedCourse,
        title: videoTitle,
        video_url: urlData.publicUrl,
        professor_id: professorId,
      });

    if (dbError) {
      toast({
        title: "Error",
        description: "Failed to save video information",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Video uploaded successfully",
    });

    setSelectedFile(null);
    setVideoTitle("");
    setSelectedCourse(null);
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
        {/* Create Course Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="mb-4">
              <Plus className="mr-2 h-4 w-4" />
              Create New Course
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

        {/* Upload Video Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="mb-4">
              <Upload className="mr-2 h-4 w-4" />
              Upload Course Video
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Course Video</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="course">Select Course</Label>
                <select
                  id="course"
                  className="w-full border rounded-md p-2"
                  onChange={(e) => setSelectedCourse(Number(e.target.value))}
                  value={selectedCourse || ""}
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="videoTitle">Video Title</Label>
                <Input
                  id="videoTitle"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="video">Video File</Label>
                <Input
                  id="video"
                  type="file"
                  accept="video/*"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
              </div>
              <Button onClick={handleFileUpload}>Upload Video</Button>
            </div>
          </DialogContent>
        </Dialog>

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
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrollments.map((enrollment) => (
                  <TableRow key={enrollment.id}>
                    <TableCell>{enrollment.course_title}</TableCell>
                    <TableCell>{enrollment.student?.name}</TableCell>
                    <TableCell>{enrollment.student?.index_number}</TableCell>
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