import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CourseFormData {
  title: string;
  description: string;
  duration: string;
  schedule: string;
  instructor: string;
}

interface CourseFormProps {
  data: CourseFormData;
  onChange: (field: keyof CourseFormData, value: string) => void;
}

export const CourseForm = ({ data, onChange }: CourseFormProps) => {
  return (
    <>
      <div>
        <Label htmlFor="title">Course Title</Label>
        <Input
          id="title"
          value={data.title}
          onChange={(e) => onChange("title", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={data.description}
          onChange={(e) => onChange("description", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="instructor">Instructor</Label>
        <Input
          id="instructor"
          value={data.instructor}
          onChange={(e) => onChange("instructor", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="duration">Duration (weeks)</Label>
        <Input
          id="duration"
          type="number"
          value={data.duration}
          onChange={(e) => onChange("duration", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="schedule">Schedule</Label>
        <Input
          id="schedule"
          value={data.schedule}
          onChange={(e) => onChange("schedule", e.target.value)}
        />
      </div>
    </>
  );
};