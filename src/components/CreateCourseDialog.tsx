import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
      // Create the course first
      await onCreateCourse(newCourse);

      // If there are materials to upload
      if (materials && materials.length > 0) {
        // Get the course ID from the newly created course
        const { data: courseData } = await supabase
          .from('courses')
          .select('id')
          .eq('title', newCourse.title)
          .single();

        if (courseData) {
          // Upload each material
          for (let i = 0; i < materials.length; i++) {
            const file = materials[i];
            const fileExt = file.name.split('.').pop();
            const filePath = `${courseData.id}/${crypto.randomUUID()}.${fileExt}`;

            // Upload file to storage
            const { error: uploadError } = await supabase.storage
              .from('course_materials')
              .upload(filePath, file);

            if (uploadError) {
              throw uploadError;
            }

            // Get the public URL
            const { data: publicUrl } = supabase.storage
              .from('course_materials')
              .getPublicUrl(filePath);

            // Create material record in the database
            const { error: materialError } = await supabase
              .from('course_materials')
              .insert({
                course_id: courseData.id,
                title: file.name,
                type: file.type,
                url: publicUrl.publicUrl
              });

            if (materialError) {
              throw materialError;
            }
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
          <div>
            <Label htmlFor="materials">Course Materials</Label>
            <Input
              id="materials"
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt"
              onChange={(e) => setMaterials(e.target.files)}
              className="cursor-pointer"
            />
            <p className="text-sm text-gray-500 mt-1">
              Supported formats: PDF, Word documents, and text files
            </p>
          </div>
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