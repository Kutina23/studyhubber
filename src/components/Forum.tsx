import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Discussion, FormValues, ReplyFormValues } from "@/types/forum";
import NewDiscussionForm from "./forum/NewDiscussionForm";
import DiscussionCard from "./forum/DiscussionCard";

const Forum = () => {
  const { toast } = useToast();
  const [selectedDiscussion, setSelectedDiscussion] = useState<Discussion | null>(null);
  const [discussions, setDiscussions] = useState<Discussion[]>([
    {
      id: 1,
      title: "Tips for Final Exams",
      author: "Sarah Johnson",
      content: "Here are some tips for preparing for final exams...",
      replies: [
        {
          id: 1,
          content: "Thanks for sharing these tips!",
          author: "John Doe",
          createdAt: "2024-01-21",
        }
      ],
      lastActivity: "2024-01-20",
    },
    {
      id: 2,
      title: "Study Group for Computer Science",
      author: "Mike Chen",
      content: "Looking for study partners for CS courses...",
      replies: [],
      lastActivity: "2024-01-19",
    },
    {
      id: 3,
      title: "Research Paper Guidelines",
      author: "Prof. Williams",
      content: "Important guidelines for your research papers...",
      replies: [],
      lastActivity: "2024-01-18",
    },
  ]);

  const handleNewDiscussion = (data: FormValues) => {
    const newDiscussion: Discussion = {
      id: discussions.length + 1,
      title: data.title,
      content: data.content,
      author: "Current User",
      replies: [],
      lastActivity: new Date().toISOString().split('T')[0],
    };

    setDiscussions([newDiscussion, ...discussions]);
    toast({
      title: "Discussion Created",
      description: "Your discussion has been successfully created.",
    });
  };

  const handleReply = (content: string) => {
    if (!selectedDiscussion) return;

    const newReply = {
      id: selectedDiscussion.replies.length + 1,
      content,
      author: "Current User",
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updatedDiscussions = discussions.map(discussion =>
      discussion.id === selectedDiscussion.id
        ? {
            ...discussion,
            replies: [...discussion.replies, newReply],
            lastActivity: new Date().toISOString().split('T')[0],
          }
        : discussion
    );

    setDiscussions(updatedDiscussions);
    setSelectedDiscussion(null);
    toast({
      title: "Reply Added",
      description: "Your reply has been successfully added to the discussion.",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Discussion Forum</h1>
        <NewDiscussionForm onSubmit={handleNewDiscussion} />
      </div>

      <div className="space-y-4">
        {discussions.map((discussion) => (
          <DiscussionCard
            key={discussion.id}
            discussion={discussion}
            selectedDiscussionId={selectedDiscussion?.id ?? null}
            onReplyClick={(id) => setSelectedDiscussion(discussions.find(d => d.id === id) ?? null)}
            onReplySubmit={handleReply}
            onReplyDialogClose={() => setSelectedDiscussion(null)}
          />
        ))}
      </div>
    </div>
  );
};

export default Forum;