import { Card } from "@/components/ui/card";
import { FileText, Download, Book, Video, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";

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
  file: FileList;
};

export const Resources = () => {
  const { toast } = useToast();
  const form = useForm<UploadFormValues>();
  const [resources, setResources] = useState<Resource[]>([]);

  // Load resources from localStorage on component mount
  useEffect(() => {
    const savedResources = localStorage.getItem('uploadedResources');
    if (savedResources) {
      setResources(JSON.parse(savedResources));
    }
  }, []);

  // Save resources to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('uploadedResources', JSON.stringify(resources));
  }, [resources]);

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
                  render={({ field: { onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>File</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          onChange={(e) => {
                            const files = e.target.files;
                            if (files?.length) {
                              onChange(files);
                            }
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