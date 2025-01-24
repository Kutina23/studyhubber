import { Card } from "@/components/ui/card";
import { FileText, Download, Book, Video, Upload, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";

type UploadFormValues = {
  name: string;
  file: FileList;
};

export const Resources = () => {
  const { toast } = useToast();
  const form = useForm<UploadFormValues>();

  const resources = [
    {
      id: 1,
      title: "Course Materials",
      items: [
        {
          id: "cm1",
          name: "Introduction to Programming PDF",
          type: "document",
          size: "2.4 MB",
        },
        {
          id: "cm2",
          name: "Data Structures Lecture Notes",
          type: "document",
          size: "1.8 MB",
        },
      ],
    },
    {
      id: 2,
      title: "Video Lectures",
      items: [
        {
          id: "vl1",
          name: "Algorithm Analysis Tutorial",
          type: "video",
          duration: "45 mins",
        },
        {
          id: "vl2",
          name: "Database Design Fundamentals",
          type: "video",
          duration: "60 mins",
        },
      ],
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "document":
        return FileText;
      case "video":
        return Video;
      default:
        return Book;
    }
  };

  const onSubmit = (data: UploadFormValues) => {
    // Here you would typically handle the file upload to a backend service
    toast({
      title: "File Uploaded",
      description: `${data.name} has been successfully uploaded.`,
    });
    form.reset();
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
                            if (e.target.files) {
                              onChange(e.target.files);
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
        {resources.map((category) => (
          <Card key={category.id} className="p-6">
            <h2 className="text-xl font-semibold mb-4">{category.title}</h2>
            <div className="space-y-4">
              {category.items.map((item) => {
                const ItemIcon = getIcon(item.type);
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center">
                      <ItemIcon className="w-5 h-5 text-primary mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-500">
                          {item.type === "video" ? item.duration : item.size}
                        </p>
                      </div>
                    </div>
                    <Download className="w-5 h-5 text-gray-400 hover:text-primary cursor-pointer" />
                  </div>
                );
              })}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};