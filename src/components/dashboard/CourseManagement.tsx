import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseCreationForm } from "../admin/CourseCreationForm";

interface CourseManagementProps {
  onCourseCreated: () => void;
}

export const CourseManagement = ({ onCourseCreated }: CourseManagementProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Management</CardTitle>
      </CardHeader>
      <CardContent>
        <CourseCreationForm onCourseCreated={onCourseCreated} />
      </CardContent>
    </Card>
  );
};