import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { Discussion } from "@/types/forum";
import ReplyForm from "./ReplyForm";

interface DiscussionCardProps {
  discussion: Discussion;
  selectedDiscussionId: number | null;
  onReplyClick: (discussionId: number) => void;
  onReplySubmit: (content: string) => void;
  onReplyDialogClose: () => void;
}

const DiscussionCard = ({
  discussion,
  selectedDiscussionId,
  onReplyClick,
  onReplySubmit,
  onReplyDialogClose,
}: DiscussionCardProps) => {
  return (
    <Card key={discussion.id} className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900">
            {discussion.title}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Started by {discussion.author}
          </p>
          <p className="text-sm text-gray-700 mt-2">
            {discussion.content}
          </p>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <MessageSquare className="w-4 h-4 mr-1" />
          {discussion.replies.length} replies
        </div>
      </div>
      
      {discussion.replies.length > 0 && (
        <div className="mt-4 space-y-3">
          <h4 className="text-sm font-medium text-gray-900">Replies</h4>
          {discussion.replies.map((reply) => (
            <div key={reply.id} className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-700">{reply.content}</p>
              <div className="mt-2 text-xs text-gray-500">
                {reply.author} - {reply.createdAt}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4">
        <ReplyForm
          isOpen={selectedDiscussionId === discussion.id}
          onOpenChange={(open) => !open && onReplyDialogClose()}
          onSubmit={(data) => onReplySubmit(data.content)}
        />
        <Button 
          variant="outline" 
          onClick={() => onReplyClick(discussion.id)}
        >
          Reply
        </Button>
      </div>
      
      <div className="mt-4 text-xs text-gray-400">
        Last activity: {discussion.lastActivity}
      </div>
    </Card>
  );
};

export default DiscussionCard;