import { Card } from "@/components/ui/card";
import { MessageSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Forum = () => {
  const discussions = [
    {
      id: 1,
      title: "Tips for Final Exams",
      author: "Sarah Johnson",
      replies: 15,
      lastActivity: "2024-01-20",
    },
    {
      id: 2,
      title: "Study Group for Computer Science",
      author: "Mike Chen",
      replies: 8,
      lastActivity: "2024-01-19",
    },
    {
      id: 3,
      title: "Research Paper Guidelines",
      author: "Prof. Williams",
      replies: 23,
      lastActivity: "2024-01-18",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Discussion Forum</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Discussion
        </Button>
      </div>

      <div className="space-y-4">
        {discussions.map((discussion) => (
          <Card key={discussion.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">
                  {discussion.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Started by {discussion.author}
                </p>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <MessageSquare className="w-4 h-4 mr-1" />
                {discussion.replies} replies
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-400">
              Last activity: {discussion.lastActivity}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};