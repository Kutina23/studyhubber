
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CourseActions } from "./CourseActions";

interface Course {
  id: number;
  title: string;
  description: string;
  duration: number;
  schedule: string;
  instructor: string;
}

interface CoursesTableProps {
  courses: Course[];
  onEditCourse: (course: Course) => void;
  onDeleteCourse: (courseId: number) => void;
  onCourseUpdated: () => void;
}

export const CoursesTable = ({
  courses,
  onEditCourse,
  onDeleteCourse,
  onCourseUpdated,
}: CoursesTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Duration (weeks)</TableHead>
          <TableHead>Schedule</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {courses.map((course) => (
          <TableRow key={course.id}>
            <TableCell>{course.title}</TableCell>
            <TableCell>{course.duration}</TableCell>
            <TableCell>{course.schedule}</TableCell>
            <TableCell>
              <CourseActions
                courseId={course.id}
                onEdit={() => onEditCourse(course)}
                onDelete={onDeleteCourse}
                onVideoUploaded={onCourseUpdated}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
