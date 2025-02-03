import { Card } from "@/components/ui/card";
import { Download, Book, FileText, Video } from "lucide-react";

interface Resource {
  id: string;
  name: string;
  type: string;
  size: string;
  file: File;
  uploadedAt: string;
}

interface UploadedResourcesListProps {
  resources: Resource[];
  onDownload: (resource: Resource) => void;
}

export const UploadedResourcesList = ({ resources, onDownload }: UploadedResourcesListProps) => {
  const getIcon = (type: string) => {
    switch (type) {
      case "application/pdf":
        return FileText;
      case "video/mp4":
        return Video;
      default:
        return Book;
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Uploaded Resources</h2>
      <div className="space-y-4">
        {resources.map((resource) => {
          const ItemIcon = getIcon(resource.type);
          return (
            <div
              key={resource.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center">
                <ItemIcon className="w-5 h-5 text-primary mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">{resource.name}</h3>
                  <p className="text-sm text-gray-500">{resource.size}</p>
                </div>
              </div>
              <Download 
                className="w-5 h-5 text-gray-400 hover:text-primary cursor-pointer" 
                onClick={() => onDownload(resource)}
              />
            </div>
          );
        })}
        {resources.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            No resources uploaded yet
          </div>
        )}
      </div>
    </Card>
  );
};