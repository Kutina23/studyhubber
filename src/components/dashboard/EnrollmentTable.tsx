import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Enrollment {
  id: string;
  course_title: string;
  course_id: number;
  student: {
    name: string;
    index_number: string;
  };
}

interface EnrollmentTableProps {
  enrollments: Enrollment[];
  isAdmin: boolean;
  onDeleteCourse: (courseId: number) => Promise<void>;
}

export const EnrollmentTable = ({ enrollments, isAdmin, onDeleteCourse }: EnrollmentTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Course</TableHead>
          <TableHead>Student Name</TableHead>
          <TableHead>Student ID</TableHead>
          {isAdmin && <TableHead>Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {enrollments.map((enrollment) => (
          <TableRow key={enrollment.id}>
            <TableCell>{enrollment.course_title}</TableCell>
            <TableCell>{enrollment.student?.name || 'N/A'}</TableCell>
            <TableCell>{enrollment.student?.index_number || 'N/A'}</TableCell>
            {isAdmin && (
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDeleteCourse(enrollment.course_id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};