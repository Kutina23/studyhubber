import { Card } from "@/components/ui/card";
import { Bell, Book, MessageSquare, FileText } from "lucide-react";

const Dashboard = () => {
  const announcements = [
    {
      id: 1,
      title: "Welcome to the New Semester",
      content: "Important dates and information for the upcoming term.",
      date: "2024-01-15",
    },
    {
      id: 2,
      title: "Library Resources Update",
      content: "New digital resources available for all students.",
      date: "2024-01-14",
    },
  ];

  const courses = [
    {
      id: 1,
      name: "Introduction to Computer Science",
      instructor: "Dr. Smith",
      progress: 60,
    },
    {
      id: 2,
      name: "Advanced Mathematics",
      instructor: "Prof. Johnson",
      progress: 45,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <Bell className="w-5 h-5 text-primary mr-2" />
            <h2 className="text-xl font-semibold">Announcements</h2>
          </div>
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="border-b pb-4">
                <h3 className="font-medium text-gray-900">{announcement.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{announcement.content}</p>
                <span className="text-xs text-gray-400 mt-2 block">
                  {announcement.date}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center mb-4">
            <Book className="w-5 h-5 text-primary mr-2" />
            <h2 className="text-xl font-semibold">My Courses</h2>
          </div>
          <div className="space-y-4">
            {courses.map((course) => (
              <div key={course.id} className="border-b pb-4">
                <h3 className="font-medium text-gray-900">{course.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Instructor: {course.instructor}
                </p>
                <div className="mt-2 h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <MessageSquare className="w-5 h-5 text-primary mr-2" />
            <h2 className="text-xl font-semibold">Recent Discussions</h2>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">No recent discussions</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center mb-4">
            <FileText className="w-5 h-5 text-primary mr-2" />
            <h2 className="text-xl font-semibold">Recent Resources</h2>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">No recent resources</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
