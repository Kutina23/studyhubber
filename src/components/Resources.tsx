import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { ResourceUploadForm } from "./resources/ResourceUploadForm";
import { CourseMaterialsList } from "./resources/CourseMaterialsList";
import { UploadedResourcesList } from "./resources/UploadedResourcesList";
import { Button } from "./ui/button";
import { useNavigate, useLocation } from "react-router-dom";

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
  const navigate = useNavigate();
  const location = useLocation();
  const courseId = location.state?.courseId;
  const [resources, setResources] = useState<Resource[]>([]);
  const [courseMaterials, setCourseMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentProfile, setStudentProfile] = useState<any>(null);

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
        }
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
    };

    fetchStudentProfile();
  }, [toast]);

  useEffect(() => {
    const fetchCourseMaterials = async () => {
      if (!studentProfile) return;

      try {
        setLoading(true);
        
        let query = supabase
          .from('enrollments')
          .select('course_id')
          .eq('student_id', studentProfile.id)
          .eq('status', 'active');

        if (courseId) {
          query = query.eq('course_id', courseId);
        }

        const { data: enrollments, error: enrollmentError } = await query;

        if (enrollmentError) {
          toast({
            title: "Error",
            description: "Failed to fetch your enrollments",
            variant: "destructive",
          });
          return;
        }

        if (!enrollments || enrollments.length === 0) {
          setLoading(false);
          return;
        }

        const courseIds = enrollments.map(e => e.course_id);
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
  }, [studentProfile, courseId, toast]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUpload = (data: UploadFormValues) => {
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Learning Resources</h1>
        <ResourceUploadForm onSubmit={handleUpload} />
      </div>

      <div className="space-y-6">
        <CourseMaterialsList 
          materials={courseMaterials}
          loading={loading}
          studentProfile={studentProfile}
        />
        <UploadedResourcesList 
          resources={resources}
          onDownload={handleDownload}
        />
      </div>
    </div>
  );
};
