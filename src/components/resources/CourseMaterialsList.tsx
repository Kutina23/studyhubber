import { Card } from "@/components/ui/card";
import { Download, Book, FileText, Video } from "lucide-react";

interface CourseMaterial {
  id: string;
  title: string;
  type: string;
  url: string;
  courses?: {
    title: string;
  };
}

interface CourseMaterialsListProps {
  materials: CourseMaterial[];
  loading: boolean;
  studentProfile: any | null;
}

export const CourseMaterialsList = ({ materials, loading, studentProfile }: CourseMaterialsListProps) => {
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
      <h2 className="text-xl font-semibold mb-4">Course Materials</h2>
      <div className="space-y-4">
        {materials.map((material) => {
          const ItemIcon = getIcon(material.type);
          return (
            <div
              key={material.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center">
                <ItemIcon className="w-5 h-5 text-primary mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">{material.title}</h3>
                  <p className="text-sm text-gray-500">
                    {material.courses?.title ? `Course: ${material.courses.title}` : 'Course title not available'}
                  </p>
                </div>
              </div>
              <a 
                href={material.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80"
              >
                <Download className="w-5 h-5" />
              </a>
            </div>
          );
        })}
        {materials.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            {!studentProfile ? (
              "Please complete your student profile to access course materials"
            ) : (
              "No course materials available for your enrolled courses"
            )}
          </div>
        )}
      </div>
    </Card>
  );
};