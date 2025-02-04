import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CourseForm } from "./course/CourseForm";
import { MaterialsUploader } from "./course/MaterialsUploader";

interface CreateCourseDialogProps {
  onCreateCourse: (courseData: {
    title: string;
    description: string;
    duration: string;
    schedule: string;
    instructor: string;
  }) => Promise<void>;
}

export const CreateCourseDialog = ({ onCreateCourse }: CreateCourseDialogProps) => {
  const { toast } = useToast();
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    duration: "",
    schedule: "",
    instructor: "",
  });
  const [materials, setMaterials] = useState<FileList | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleCreateCourse = async () => {
    setIsUploading(true);
    try {
      await onCreateCourse(newCourse);

      if (materials && materials.length > 0) {
        const { data: courseData } = await supabase
          .from('courses')
          .select('id')
          .eq('title', newCourse.title)
          .single();

        if (courseData) {
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
                url: publicUrl.publicUrl
              });

            if (materialError) throw materialError;
          }
        }
      }

      toast({
        title: "Success",
        description: "Course and materials created successfully",
      });
      setOpen(false);
      setNewCourse({
        title: "",
        description: "",
        duration: "",
        schedule: "",
        instructor: "",
      });
      setMaterials(null);
    } catch (error) {
      console.error('Error creating course:', error);
      toast({
        title: "Error",
        description: "Failed to create course and upload materials",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFormChange = (field: keyof typeof newCourse, value: string) => {
    setNewCourse(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
          <CourseForm 
            data={newCourse}
            onChange={handleFormChange}
          />
          <MaterialsUploader 
            onChange={setMaterials}
          />
          <Button 
            onClick={handleCreateCourse} 
            disabled={isUploading}
            className="w-full"
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