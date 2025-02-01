import { CourseCard } from "./CourseCard";
import { CreateCourseDialog } from "./CreateCourseDialog";
import { useCourses } from "@/hooks/useCourses";

export const Courses = () => {
  const {
    courses,
    enrolledCourses,
    isAdmin,
    createCourse,
    enrollInCourse,
  } = useCourses();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Available Courses</h1>
        {isAdmin && <CreateCourseDialog onCreateCourse={createCourse} />}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            isEnrolled={enrolledCourses.includes(course.id)}
            onEnroll={enrollInCourse}
          />
        ))}
      </div>
    </div>
  );
};