import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CourseBasicInfoProps {
  formData: {
    title: string;
    description: string;
    duration: string;
    schedule: string;
  };
  onChange: (field: string, value: string) => void;
}

export const CourseBasicInfo = ({ formData, onChange }: CourseBasicInfoProps) => {
  return (
    <>
      <div>
        <Label htmlFor="title">Course Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => onChange("title", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onChange("description", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="duration">Duration (weeks)</Label>
        <Input
          id="duration"
          type="number"
          value={formData.duration}
          onChange={(e) => onChange("duration", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="schedule">Schedule</Label>
        <Input
          id="schedule"
          placeholder="e.g., Mon/Wed 2:00 PM - 4:00 PM"
          value={formData.schedule}
          onChange={(e) => onChange("schedule", e.target.value)}
        />
      </div>
    </>
  );
};