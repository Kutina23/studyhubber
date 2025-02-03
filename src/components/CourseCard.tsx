import { Card } from "@/components/ui/card";
import { Book, Clock, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface CourseCardProps {
  course: {
    id: number;
    title: string;
    description: string;
    instructor: string;
    schedule: string;
    duration: number;
  };
  isEnrolled: boolean;
  onEnroll: (courseId: number, courseTitle: string) => void;
}

export const CourseCard = ({ course, isEnrolled, onEnroll }: CourseCardProps) => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (isEnrolled) {
      // Navigate to resources page when viewing an enrolled course
      navigate('/resources', { state: { courseId: course.id } });
    } else {
      onEnroll(course.id, course.title);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-gray-900">{course.title}</h2>
      <p className="text-sm text-gray-500 mt-2">{course.description}</p>

      <div className="mt-4 space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <Book className="w-4 h-4 mr-2" />
          Instructor: {course.instructor}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          Schedule: {course.schedule}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="w-4 h-4 mr-2" />
          Duration: {course.duration} weeks
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Users className="w-4 h-4 mr-2" />
          {isEnrolled ? "You're enrolled" : "Enroll now"}
        </div>
      </div>

      <div className="mt-6">
        <Button
          className="w-full"
          variant={isEnrolled ? "secondary" : "default"}
          onClick={handleButtonClick}
        >
          {isEnrolled ? "View Course" : "Enroll Now"}
        </Button>
      </div>
    </Card>
  );
};