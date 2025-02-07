
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoUploadDialog } from "@/components/course/VideoUploadDialog";

interface CourseActionsProps {
  courseId: number;
  onEdit: () => void;
  onDelete: (courseId: number) => void;
  onVideoUploaded: () => void;
}

export const CourseActions = ({
  courseId,
  onEdit,
  onDelete,
  onVideoUploaded,
}: CourseActionsProps) => {
  return (
    <div className="space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onEdit}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => onDelete(courseId)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      <VideoUploadDialog 
        courseId={courseId}
        onVideoUploaded={onVideoUploaded}
      />
    </div>
  );
};
