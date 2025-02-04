import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { CourseBasicInfo } from "./CourseBasicInfo";
import { ProfessorSelector } from "./ProfessorSelector";
import { VideoUploader } from "./VideoUploader";
import { MaterialsUploader } from "../course/MaterialsUploader";

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
  const [materials, setMaterials] = useState<FileList | null>(null);
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

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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

      // Handle video upload
      if (videoFile && courseData) {
        const fileExt = videoFile.name.split('.').pop();
        const filePath = `${courseData.id}/${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('course_videos')
          .upload(filePath, videoFile);

        if (uploadError) throw uploadError;

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

      // Handle materials upload
      if (materials && materials.length > 0 && courseData) {
        for (let i = 0; i < materials.length; i++) {
          const file = materials[i];
          const fileExt = file.name.split('.').pop();
          const filePath = `${courseData.id}/${crypto.randomUUID()}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from('course_materials')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data: publicUrl } = supabase.storage
            .from('course_materials')
            .getPublicUrl(filePath);

          const { error: materialError } = await supabase
            .from('course_materials')
            .insert({
              course_id: courseData.id,
              title: file.name,
              type: file.type,
              url: publicUrl.publicUrl,
              professor_id: selectedProfessor,
            });

          if (materialError) throw materialError;
        }
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
      setMaterials(null);
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
          <CourseBasicInfo formData={formData} onChange={handleFormChange} />
          <ProfessorSelector 
            professors={professors}
            selectedProfessor={selectedProfessor}
            onSelect={setSelectedProfessor}
          />
          <VideoUploader 
            videoFile={videoFile}
            onFileChange={setVideoFile}
          />
          <MaterialsUploader 
            onChange={setMaterials}
          />
          <Button 
            onClick={handleCreateCourse} 
            className="w-full"
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Upload className="mr-2 h-4 w-4 animate-spin" />
                Creating Course...
              </>
            ) : (
              'Create Course'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};