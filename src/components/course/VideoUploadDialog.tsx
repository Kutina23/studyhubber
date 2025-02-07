
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VideoIcon, Upload } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface VideoUploadDialogProps {
  courseId: number;
  onVideoUploaded: () => void;
}

export const VideoUploadDialog = ({ courseId, onVideoUploaded }: VideoUploadDialogProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");

  const handleUpload = async () => {
    if (!videoFile || !title) {
      toast({
        title: "Error",
        description: "Please provide both a title and a video file",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = videoFile.name.split('.').pop();
      const filePath = `${courseId}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('course_videos')
        .upload(filePath, videoFile);

      if (uploadError) throw uploadError;

      const { data: publicUrl } = supabase.storage
        .from('course_videos')
        .getPublicUrl(filePath);

      const { error: videoError } = await supabase
        .from('course_videos')
        .insert({
          course_id: courseId,
          title: title,
          video_url: publicUrl.publicUrl
        });

      if (videoError) throw videoError;

      toast({
        title: "Success",
        description: "Video uploaded successfully",
      });

      setVideoFile(null);
      setTitle("");
      onVideoUploaded();
    } catch (error) {
      console.error('Error uploading video:', error);
      toast({
        title: "Error",
        description: "Failed to upload video",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <VideoIcon className="h-4 w-4 mr-2" />
          Upload Video
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Course Video</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Video Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              placeholder="Enter video title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Video File</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
              className="mt-1 block w-full"
            />
          </div>
          <Button 
            onClick={handleUpload} 
            disabled={isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Upload className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              'Upload Video'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
