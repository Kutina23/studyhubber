import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { FileText, Download, Book, Video } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type Resource = Database['public']['Tables']['resources']['Row'];
type GroupedResource = {
  id: number;
  title: string;
  items: {
    id: string;
    name: string;
    type: string;
    size?: string;
    duration?: string;
  }[];
};

const fetchResources = async (): Promise<GroupedResource[]> => {
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching resources:', error);
    throw new Error('Failed to fetch resources');
  }
  
  if (!data) {
    return [];
  }

  return data.reduce((acc: GroupedResource[], resource: Resource) => {
    const category = resource.type === 'video' ? 'Video Lectures' : 'Course Materials';
    let existingCategory = acc.find(c => c.title === category);
    
    if (!existingCategory) {
      existingCategory = {
        id: acc.length + 1,
        title: category,
        items: []
      };
      acc.push(existingCategory);
    }
    
    existingCategory.items.push({
      id: resource.id.toString(),
      name: resource.name,
      type: resource.type,
      ...(resource.type === 'video' 
        ? { duration: '45 mins' }
        : { size: '2.4 MB' }
      )
    });
    
    return acc;
  }, []);
};

export const Resources = () => {
  const { data: resources, isLoading, error } = useQuery({
    queryKey: ['resources'],
    queryFn: fetchResources,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "document":
        return FileText;
      case "video":
        return Video;
      default:
        return Book;
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-4">
            <div className="h-40 bg-gray-200 rounded"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Resources error:', error);
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load resources. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!resources || resources.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <Alert>
          <AlertDescription>
            No resources found.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Learning Resources</h1>

      <div className="space-y-6">
        {resources.map((category) => (
          <Card key={category.id} className="p-6">
            <h2 className="text-xl font-semibold mb-4">{category.title}</h2>
            <div className="space-y-4">
              {category.items.map((item) => {
                const ItemIcon = getIcon(item.type);
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center">
                      <ItemIcon className="w-5 h-5 text-primary mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-500">
                          {item.type === "video" ? item.duration : item.size}
                        </p>
                      </div>
                    </div>
                    <Download className="w-5 h-5 text-gray-400 hover:text-primary cursor-pointer" />
                  </div>
                );
              })}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};