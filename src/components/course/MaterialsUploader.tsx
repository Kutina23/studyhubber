import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MaterialsUploaderProps {
  onChange: (files: FileList | null) => void;
}

export const MaterialsUploader = ({ onChange }: MaterialsUploaderProps) => {
  return (
    <div>
      <Label htmlFor="materials">Course Materials</Label>
      <Input
        id="materials"
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.txt"
        onChange={(e) => onChange(e.target.files)}
        className="cursor-pointer"
      />
      <p className="text-sm text-gray-500 mt-1">
        Supported formats: PDF, Word documents, and text files
      </p>
    </div>
  );
};