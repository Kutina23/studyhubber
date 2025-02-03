import { Card } from "@/components/ui/card";
import { FileText, Download, Book, Video, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

type Resource = {
  id: string;
  name: string;
  type: string;
  size: string;
  file: File;
  uploadedAt: string;
};

type UploadFormValues = {
  name: string;
  file: FileList | null;
};

export const Resources = () => {
  const { toast } = useToast();
  const form = useForm<UploadFormValues>();
  const [resources, setResources] = useState<Resource[]>([]);
  const [courseMaterials, setCourseMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseMaterials = async () => {
      try {
        setLoading(true);
        // First get the current user's student profile
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast({
            title: "Error",
            description: "You must be logged in to view course materials",
            variant: "destructive",
          });
          return;
        }

        const { data: studentData, error: studentError } = await supabase
          .from('students')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (studentError || !studentData) {
          toast({
            title: "Error",
            description: "Please create your student profile first",
            variant: "destructive",
          });
          return;
        }

        // Get the student's enrollments
        const { data: enrollments, error: enrollmentError } = await supabase
          .from('enrollments')
          .select('course_id')
          .eq('student_id', studentData.id);

        if (enrollmentError) {
          toast({
            title: "Error",
            description: "Failed to fetch your enrollments",
            variant: "destructive",
          });
          return;
        }

        if (!enrollments || enrollments.length === 0) {
          toast({
            title: "No Enrollments",
            description: "You are not enrolled in any courses yet",
          });
          return;
        }

        // Get course materials for enrolled courses
        const courseIds = enrollments.map(e => e.course_id);
        const { data: materials, error: materialsError } = await supabase
          .from('course_materials')
          .select('*')
          .in('course_id', courseIds);

        if (materialsError) {
          toast({
            title: "Error",
            description: "Failed to fetch course materials",
            variant: "destructive",
          });
          return;
        }

        setCourseMaterials(materials || []);
      } catch (error) {
        console.error('Error fetching course materials:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCourseMaterials();
  }, [toast]);

  const getIcon = (type: string) => {
    switch (type) {
      case "application/pdf":
        return FileText;
      case "video/mp4":
        return Video;
      default:
        return Book;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const onSubmit = (data: UploadFormValues) => {
    if (data.file && data.file[0]) {
      const file = data.file[0];
      const newResource: Resource = {
        id: Date.now().toString(),
        name: data.name || file.name,
        type: file.type,
        size: formatFileSize(file.size),
        file: file,
        uploadedAt: new Date().toISOString(),
      };

      setResources(prev => [...prev, newResource]);
      
      toast({
        title: "File Uploaded",
        description: `${newResource.name} has been successfully uploaded.`,
      });
      form.reset();
    }
  };

  const handleDownload = (resource: Resource) => {
    const url = URL.createObjectURL(resource.file);
    const a = document.createElement('a');
    a.href = url;
    a.download = resource.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="text-center">Loading course materials...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Learning Resources</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload Resource
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Resource</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resource Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter resource name" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="file"
                  render={({ field: { onChange, value, ...field } }) => (
                    <FormItem>
                      <FormLabel>File</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          onChange={(e) => {
                            onChange(e.target.files);
                          }}
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Upload
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Course Materials</h2>
          <div className="space-y-4">
            {courseMaterials.map((material) => {
              const ItemIcon = getIcon(material.type);
              return (
                <div
                  key={material.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center">
                    <ItemIcon className="w-5 h-5 text-primary mr-3" />
                    <div>
                      <h3 className="font-medium text-gray-900">{material.title}</h3>
                      <p className="text-sm text-gray-500">{material.type}</p>
                    </div>
                  </div>
                  <a 
                    href={material.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80"
                  >
                    <Download className="w-5 h-5" />
                  </a>
                </div>
              );
            })}
            {courseMaterials.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                No course materials available for your enrolled courses
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Uploaded Resources</h2>
          <div className="space-y-4">
            {resources.map((resource) => {
              const ItemIcon = getIcon(resource.type);
              return (
                <div
                  key={resource.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center">
                    <ItemIcon className="w-5 h-5 text-primary mr-3" />
                    <div>
                      <h3 className="font-medium text-gray-900">{resource.name}</h3>
                      <p className="text-sm text-gray-500">{resource.size}</p>
                    </div>
                  </div>
                  <Download 
                    className="w-5 h-5 text-gray-400 hover:text-primary cursor-pointer" 
                    onClick={() => handleDownload(resource)}
                  />
                </div>
              );
            })}
            {resources.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                No resources uploaded yet
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
