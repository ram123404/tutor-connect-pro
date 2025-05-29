
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface TutorDetailsFormProps {
  onDetailsChange: (details: TutorDetails) => void;
  initialDetails?: TutorDetails;
}

interface TutorDetails {
  subjects: string[];
  experience: number;
  availability: string;
  monthlyRate: number;
  education: string[];
  about: string;
}

const TutorDetailsForm: React.FC<TutorDetailsFormProps> = ({ onDetailsChange, initialDetails }) => {
  const [details, setDetails] = useState<TutorDetails>(initialDetails || {
    subjects: [],
    experience: 0,
    availability: '',
    monthlyRate: 0,
    education: [],
    about: ''
  });
  const [newSubject, setNewSubject] = useState('');
  const [newEducation, setNewEducation] = useState('');

  const updateDetails = (newDetails: Partial<TutorDetails>) => {
    const updated = { ...details, ...newDetails };
    setDetails(updated);
    onDetailsChange(updated);
  };

  const addSubject = () => {
    if (newSubject.trim() && !details.subjects.includes(newSubject.trim())) {
      updateDetails({ subjects: [...details.subjects, newSubject.trim()] });
      setNewSubject('');
    }
  };

  const removeSubject = (subject: string) => {
    updateDetails({ subjects: details.subjects.filter(s => s !== subject) });
  };

  const addEducation = () => {
    if (newEducation.trim() && !details.education.includes(newEducation.trim())) {
      updateDetails({ education: [...details.education, newEducation.trim()] });
      setNewEducation('');
    }
  };

  const removeEducation = (education: string) => {
    updateDetails({ education: details.education.filter(e => e !== education) });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tutor Profile Details</CardTitle>
        <CardDescription>
          Please provide additional information about your tutoring experience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Subjects You Teach</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Add a subject"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubject())}
            />
            <Button type="button" onClick={addSubject}>Add</Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {details.subjects.map((subject) => (
              <Badge key={subject} variant="secondary" className="flex items-center gap-1">
                {subject}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeSubject(subject)}
                />
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="experience">Years of Experience</Label>
          <Input
            id="experience"
            type="number"
            min="0"
            value={details.experience}
            onChange={(e) => updateDetails({ experience: parseInt(e.target.value) || 0 })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="availability">Availability</Label>
          <Input
            id="availability"
            placeholder="e.g., Weekdays 6-9 PM, Weekends 9 AM-5 PM"
            value={details.availability}
            onChange={(e) => updateDetails({ availability: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="monthlyRate">Expected Monthly Rate (₹)</Label>
          <Input
            id="monthlyRate"
            type="number"
            min="0"
            value={details.monthlyRate}
            onChange={(e) => updateDetails({ monthlyRate: parseInt(e.target.value) || 0 })}
          />
        </div>

        <div className="space-y-2">
          <Label>Education/Qualifications</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Add education/qualification"
              value={newEducation}
              onChange={(e) => setNewEducation(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEducation())}
            />
            <Button type="button" onClick={addEducation}>Add</Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {details.education.map((edu) => (
              <Badge key={edu} variant="secondary" className="flex items-center gap-1">
                {edu}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeEducation(edu)}
                />
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="about">About Yourself</Label>
          <Textarea
            id="about"
            placeholder="Tell students about your teaching style, approach, etc."
            value={details.about}
            onChange={(e) => updateDetails({ about: e.target.value })}
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TutorDetailsForm;
