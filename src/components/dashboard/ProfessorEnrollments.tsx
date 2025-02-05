import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EnrollmentTable } from "./EnrollmentTable";

interface ProfessorEnrollmentsProps {
  enrollments: any[];
  onDeleteCourse: (courseId: number) => Promise<void>;
}

export const ProfessorEnrollments = ({ enrollments, onDeleteCourse }: ProfessorEnrollmentsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Enrollments</CardTitle>
      </CardHeader>
      <CardContent>
        <EnrollmentTable 
          enrollments={enrollments}
          isAdmin={false}
          onDeleteCourse={onDeleteCourse}
        />
      </CardContent>
    </Card>
  );
};