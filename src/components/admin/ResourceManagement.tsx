import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { FileText, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Resource {
  name: string;
  type: string;
  url: string;
}

export const ResourceManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [newResource, setNewResource] = useState<Resource>({
    name: "",
    type: "document",
    url: "",
  });

  const addResourceMutation = useMutation({
    mutationFn: async (resourceData: Resource) => {
      const { error } = await supabase
        .from('resources')
        .insert([resourceData]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      toast({ title: "Success", description: "Resource added successfully" });
      setNewResource({
        name: "",
        type: "document",
        url: "",
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
        <FileText className="w-5 h-5 text-primary mr-2" />
        <h2 className="text-xl font-semibold">Manage Resources</h2>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full">Add New Resource</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Resource</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Resource Name"
              value={newResource.name}
              onChange={(e) =>
                setNewResource({ ...newResource, name: e.target.value })
              }
            />
            <Input
              placeholder="Resource URL"
              value={newResource.url}
              onChange={(e) =>
                setNewResource({ ...newResource, url: e.target.value })
              }
            />
            <Button 
              onClick={() => addResourceMutation.mutate(newResource)}
              disabled={addResourceMutation.isPending}
            >
              {addResourceMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Add Resource
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};