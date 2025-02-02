import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface VideoUploaderProps {
  videoFile: File | null;
  onFileChange: (file: File | null) => void;
}

export const VideoUploader = ({ videoFile, onFileChange }: VideoUploaderProps) => {
  return (
    <div>
      <Label htmlFor="video">Course Video</Label>
      <div className="flex items-center gap-2">
        <Input
          id="video"
          type="file"
          accept="video/*"
          onChange={(e) => onFileChange(e.target.files?.[0] || null)}
        />
        {videoFile && (
          <Button variant="outline" size="icon">
            <Upload className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};