
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateCourseDialog } from "@/components/CreateCourseDialog";
import { CoursesTable } from "./CoursesTable";
import { EditCourseDialog } from "./EditCourseDialog";
import { useState } from "react";
import { CreateCourseAction } from "./course-actions/CreateCourseAction";
import { UpdateCourseAction } from "./course-actions/UpdateCourseAction";
import { DeleteCourseAction } from "./course-actions/DeleteCourseAction";

interface Course {
  id: number;
  title: string;
  description: string;
  duration: number;
  schedule: string;
  instructor: string;
}

interface ProfessorCoursesProps {
  courses: Course[];
  onCourseUpdated: () => void;
}

export const ProfessorCourses = ({ courses, onCourseUpdated }: ProfessorCoursesProps) => {
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const handleCreateCourse = CreateCourseAction({ onSuccess: onCourseUpdated });
  const handleUpdateCourse = UpdateCourseAction({ 
    courseId: editingCourse?.id || 0,
    onSuccess: () => {
      setEditingCourse(null);
      onCourseUpdated();
    }
  });
  const handleDeleteCourse = DeleteCourseAction({
    courseId: editingCourse?.id || 0,
    onSuccess: onCourseUpdated
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>My Courses</CardTitle>
        <CreateCourseDialog onCreateCourse={handleCreateCourse} />
      </CardHeader>
      <CardContent>
        <CoursesTable
          courses={courses}
          onEditCourse={setEditingCourse}
          onDeleteCourse={handleDeleteCourse}
          onCourseUpdated={onCourseUpdated}
        />
        
        <EditCourseDialog
          course={editingCourse}
          onClose={() => setEditingCourse(null)}
          onUpdate={handleUpdateCourse}
        />
      </CardContent>
    </Card>
  );
};
