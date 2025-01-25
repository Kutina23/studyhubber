import { Card } from "@/components/ui/card";
import { Bell, Book, MessageSquare, FileText, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Group = {
  id: number;
  name: string;
  description: string;
  createdAt: string;
};

type Resource = {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
};

type Course = {
  id: number;
  title: string;
  instructor: string;
  progress: number;
};

export const Dashboard = () => {
  const [recentGroups, setRecentGroups] = useState<Group[]>([]);
  const [recentResources, setRecentResources] = useState<Resource[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);

  useEffect(() => {
    // Load forum groups from localStorage
    const savedGroups = localStorage.getItem('forumGroups');
    if (savedGroups) {
      const groups = JSON.parse(savedGroups);
      setRecentGroups(groups.slice(0, 3)); // Show only 3 most recent groups
    }

    // Load resources from localStorage
    const savedResources = localStorage.getItem('uploadedResources');
    if (savedResources) {
      const resources = JSON.parse(savedResources);
      setRecentResources(resources.slice(0, 3)); // Show only 3 most recent resources
    }

    // Load enrolled courses
    const courses = [
      {
        id: 1,
        title: "Introduction to Computer Science",
        instructor: "Dr. Sarah Smith",
        progress: 60,
      },
      {
        id: 2,
        title: "Advanced Mathematics",
        instructor: "Prof. Michael Johnson",
        progress: 45,
      },
    ];
    setEnrolledCourses(courses);
  }, []);

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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Book className="w-5 h-5 text-primary mr-2" />
              <h2 className="text-xl font-semibold">My Courses</h2>
            </div>
            <Link to="/courses" className="text-sm text-primary hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {enrolledCourses.map((course) => (
              <div key={course.id} className="border-b pb-4">
                <h3 className="font-medium text-gray-900">{course.title}</h3>
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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <MessageSquare className="w-5 h-5 text-primary mr-2" />
              <h2 className="text-xl font-semibold">Recent Study Groups</h2>
            </div>
            <Link to="/forum" className="text-sm text-primary hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {recentGroups.length > 0 ? (
              recentGroups.map((group) => (
                <div key={group.id} className="border-b pb-4">
                  <h3 className="font-medium text-gray-900">{group.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{group.description}</p>
                  <span className="text-xs text-gray-400 mt-2 block">
                    Created: {group.createdAt}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No study groups joined yet</p>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FileText className="w-5 h-5 text-primary mr-2" />
              <h2 className="text-xl font-semibold">Recent Resources</h2>
            </div>
            <Link to="/resources" className="text-sm text-primary hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {recentResources.length > 0 ? (
              recentResources.map((resource) => (
                <div key={resource.id} className="border-b pb-4">
                  <h3 className="font-medium text-gray-900">{resource.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Type: {resource.type}
                  </p>
                  <span className="text-xs text-gray-400 mt-2 block">
                    Uploaded: {resource.uploadedAt}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No resources uploaded yet</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};