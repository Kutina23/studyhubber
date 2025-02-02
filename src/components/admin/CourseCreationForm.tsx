import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Professor {
  id: string;
  name: string;
  zoom_link: string | null;
  staff_id: string;
  hourly_rate: number;
}

interface CourseCreationFormProps {
  onCourseCreated: () => void;
}

export const CourseCreationForm = ({ onCourseCreated }: CourseCreationFormProps) => {
  const { toast } = useToast();
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [selectedProfessor, setSelectedProfessor] = useState<string>("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    schedule: "",
  });

  useEffect(() => {
    const fetchProfessors = async () => {
      const { data, error } = await supabase
        .from('professors')
        .select('*');
      
      if (error) {
        console.error('Error fetching professors:', error);
        toast({
          title: "Error",
          description: "Failed to load professors",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        setProfessors(data);
      }
    };

    fetchProfessors();
  }, [toast]);

  const handleCreateCourse = async () => {
    if (!selectedProfessor) {
      toast({
        title: "Error",
        description: "Please select a professor",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const professor = professors.find(p => p.id === selectedProfessor);
      if (!professor) throw new Error("Professor not found");

      // Create course
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .insert({
          title: formData.title,
          description: formData.description,
          duration: parseInt(formData.duration),
          schedule: formData.schedule,
          professor_id: selectedProfessor,
          instructor: professor.name,
        })
        .select()
        .single();

      if (courseError) throw courseError;

      // Handle video upload if a file is selected
      if (videoFile && courseData) {
        const fileExt = videoFile.name.split('.').pop();
        const filePath = `${courseData.id}/${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('course_videos')
          .upload(filePath, videoFile);

        if (uploadError) throw uploadError;

        // Create video record
        const { error: videoError } = await supabase
          .from('course_videos')
          .insert({
            course_id: courseData.id,
            title: videoFile.name,
            video_url: filePath,
            professor_id: selectedProfessor,
          });

        if (videoError) throw videoError;
      }

      toast({
        title: "Success",
        description: "Course created successfully",
      });

      setOpen(false);
      onCourseCreated();
      setFormData({
        title: "",
        description: "",
        duration: "",
        schedule: "",
      });
      setSelectedProfessor("");
      setVideoFile(null);
    } catch (error) {
      console.error('Error creating course:', error);
      toast({
        title: "Error",
        description: "Failed to create course",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Course
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Course</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <Label htmlFor="title">Course Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="professor">Professor</Label>
            <Select value={selectedProfessor} onValueChange={setSelectedProfessor}>
              <SelectTrigger>
                <SelectValue placeholder="Select a professor" />
              </SelectTrigger>
              <SelectContent>
                {professors.map((professor) => (
                  <SelectItem key={professor.id} value={professor.id}>
                    {professor.name} (Staff ID: {professor.staff_id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selectedProfessor && (
            <div>
              <Label>Professor Details</Label>
              <div className="bg-gray-50 p-4 rounded-md">
                {professors.find(p => p.id === selectedProfessor)?.zoom_link && (
                  <p className="text-sm">Zoom Link: {professors.find(p => p.id === selectedProfessor)?.zoom_link}</p>
                )}
                <p className="text-sm">Hourly Rate: ${professors.find(p => p.id === selectedProfessor)?.hourly_rate}</p>
              </div>
            </div>
          )}
          <div>
            <Label htmlFor="duration">Duration (weeks)</Label>
            <Input
              id="duration"
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="schedule">Schedule</Label>
            <Input
              id="schedule"
              placeholder="e.g., Mon/Wed 2:00 PM - 4:00 PM"
              value={formData.schedule}
              onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="video">Course Video</Label>
            <div className="flex items-center gap-2">
              <Input
                id="video"
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
              />
              {videoFile && (
                <Button variant="outline" size="icon">
                  <Upload className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          <Button 
            onClick={handleCreateCourse} 
            className="w-full"
            disabled={isUploading}
          >
            {isUploading ? "Creating Course..." : "Create Course"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};