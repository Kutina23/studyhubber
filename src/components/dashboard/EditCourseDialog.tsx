
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CourseForm } from "@/components/course/CourseForm";

interface Course {
  id: number;
  title: string;
  description: string;
  duration: number;
  schedule: string;
  instructor: string;
}

interface EditCourseDialogProps {
  course: Course | null;
  onClose: () => void;
  onUpdate: (courseData: any) => void;
}

export const EditCourseDialog = ({ course, onClose, onUpdate }: EditCourseDialogProps) => {
  if (!course) return null;

  return (
    <Dialog open={!!course} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Course</DialogTitle>
        </DialogHeader>
        <CourseForm
          data={{
            title: course.title,
            description: course.description,
            duration: course.duration.toString(),
            schedule: course.schedule,
            instructor: course.instructor,
          }}
          onChange={(field, value) => {
            onUpdate({
              ...course,
              [field]: value,
            });
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
