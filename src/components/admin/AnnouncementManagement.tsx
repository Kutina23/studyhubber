import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Bell, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Announcement {
  title: string;
  content: string;
}

export const AnnouncementManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [newAnnouncement, setNewAnnouncement] = useState<Announcement>({
    title: "",
    content: "",
  });

  const addAnnouncementMutation = useMutation({
    mutationFn: async (announcementData: Announcement) => {
      const { error } = await supabase
        .from('announcements')
        .insert([announcementData]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      toast({ title: "Success", description: "Announcement added successfully" });
      setNewAnnouncement({
        title: "",
        content: "",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <Card className="p-6">
      <div className="flex items-center mb-4">
        <Bell className="w-5 h-5 text-primary mr-2" />
        <h2 className="text-xl font-semibold">Manage Announcements</h2>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full">Add New Announcement</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Announcement</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Announcement Title"
              value={newAnnouncement.title}
              onChange={(e) =>
                setNewAnnouncement({
                  ...newAnnouncement,
                  title: e.target.value,
                })
              }
            />
            <Textarea
              placeholder="Announcement Content"
              value={newAnnouncement.content}
              onChange={(e) =>
                setNewAnnouncement({
                  ...newAnnouncement,
                  content: e.target.value,
                })
              }
            />
            <Button 
              onClick={() => addAnnouncementMutation.mutate(newAnnouncement)}
              disabled={addAnnouncementMutation.isPending}
            >
              {addAnnouncementMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Add Announcement
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};