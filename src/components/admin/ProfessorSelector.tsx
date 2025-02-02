import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Professor {
  id: string;
  name: string;
  zoom_link: string | null;
  staff_id: string;
  hourly_rate: number;
}

interface ProfessorSelectorProps {
  professors: Professor[];
  selectedProfessor: string;
  onSelect: (value: string) => void;
}

export const ProfessorSelector = ({ professors, selectedProfessor, onSelect }: ProfessorSelectorProps) => {
  return (
    <div>
      <Label htmlFor="professor">Professor</Label>
      <Select value={selectedProfessor} onValueChange={onSelect}>
        <SelectTrigger>
          <SelectValue placeholder="Select a professor" />
        </SelectTrigger>
        <SelectContent>
          {professors.map((professor) => (
            <SelectItem key={professor.id} value={professor.id}>
              {professor.name} (Staff ID: {professor.staff_id})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedProfessor && (
        <div>
          <Label>Professor Details</Label>
          <div className="bg-gray-50 p-4 rounded-md">
            {professors.find(p => p.id === selectedProfessor)?.zoom_link && (
              <p className="text-sm">Zoom Link: {professors.find(p => p.id === selectedProfessor)?.zoom_link}</p>
            )}
            <p className="text-sm">Hourly Rate: ${professors.find(p => p.id === selectedProfessor)?.hourly_rate}</p>
          </div>
        </div>
      )}
    </div>
  );
};