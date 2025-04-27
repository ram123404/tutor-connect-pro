import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, ChevronLeft } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

// Mock data for tutors
const mockTutors = [
  {
    id: '1',
    name: 'Prof. Robert Johnson',
    profilePic: 'https://randomuser.me/api/portraits/men/32.jpg',
    subjects: ['Mathematics', 'Physics'],
    experience: '8 years',
    location: 'New York, Downtown',
    rating: 4.8,
    hourlyRate: 35,
    monthlyRate: 450,
  },
  {
    id: '2',
    name: 'Dr. Emily Wilson',
    profilePic: 'https://randomuser.me/api/portraits/women/44.jpg',
    subjects: ['Chemistry', 'Biology'],
    experience: '12 years',
    location: 'New York, Uptown',
    rating: 4.9,
    hourlyRate: 40,
    monthlyRate: 520,
  },
  // ... other tutors
];

const days = [
  { id: 'monday', label: 'Monday' },
  { id: 'tuesday', label: 'Tuesday' },
  { id: 'wednesday', label: 'Wednesday' },
  { id: 'thursday', label: 'Thursday' },
  { id: 'friday', label: 'Friday' },
  { id: 'saturday', label: 'Saturday' },
  { id: 'sunday', label: 'Sunday' },
];

const timeSlots = [
  '8:00 AM - 9:00 AM',
  '9:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '12:00 PM - 1:00 PM',
  '1:00 PM - 2:00 PM',
  '2:00 PM - 3:00 PM',
  '3:00 PM - 4:00 PM',
  '4:00 PM - 5:00 PM',
  '5:00 PM - 6:00 PM',
  '6:00 PM - 7:00 PM',
  '7:00 PM - 8:00 PM',
];

const RequestTuition: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tutorId = searchParams.get('tutor');
  const { user, isAuthenticated } = useAuth();
  
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [duration, setDuration] = useState('1');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [timeSlot, setTimeSlot] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const tutor = mockTutors.find(t => t.id === tutorId);

  // Redirect if not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Redirect if tutor not found
  if (!tutor) {
    return <Navigate to="/tutors" replace />;
  }

  const handleDayToggle = (dayId: string) => {
    if (selectedDays.includes(dayId)) {
      setSelectedDays(selectedDays.filter(d => d !== dayId));
    } else {
      setSelectedDays([...selectedDays, dayId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate form
    if (!subject || !grade || !duration || !startDate || selectedDays.length === 0 || !timeSlot) {
      toast.error("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }
    
    // Mock API call to submit tuition request
    setTimeout(() => {
      toast.success("Tuition request sent successfully!");
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Request Tuition</h1>
        <Link to={`/tutors/${tutor.id}`}>
          <Button variant="outline" className="flex items-center">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Tutor Profile
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column - Tutor Summary */}
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full overflow-hidden">
                <img
                  src={tutor.profilePic}
                  alt={tutor.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <CardTitle className="text-lg">{tutor.name}</CardTitle>
                <CardDescription>
                  {tutor.subjects.join(', ')}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Monthly Rate:</span>
              <span className="font-semibold">${tutor.monthlyRate}</span>
            </div>
            <div className="flex justify-between">
              <span>Hourly Rate:</span>
              <span className="font-semibold">${tutor.hourlyRate}/hour</span>
            </div>
            <div className="flex justify-between">
              <span>Experience:</span>
              <span>{tutor.experience}</span>
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Request Form */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Tuition Details</CardTitle>
            <CardDescription>
              Please fill in the details for your tuition request
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select value={subject} onValueChange={setSubject} required>
                    <SelectTrigger id="subject">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {tutor.subjects.map((sub) => (
                        <SelectItem key={sub} value={sub}>
                          {sub}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grade">Grade/Class Level</Label>
                  <Select value={grade} onValueChange={setGrade} required>
                    <SelectTrigger id="grade">
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="elementary">Elementary School</SelectItem>
                      <SelectItem value="middleschool">Middle School</SelectItem>
                      <SelectItem value="highschool">High School</SelectItem>
                      <SelectItem value="college">College/University</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (months)</Label>
                  <Select value={duration} onValueChange={setDuration} required>
                    <SelectTrigger id="duration">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 month</SelectItem>
                      <SelectItem value="3">3 months</SelectItem>
                      <SelectItem value="6">6 months</SelectItem>
                      <SelectItem value="12">12 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Preferred Days</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-1">
                  {days.map((day) => (
                    <div key={day.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={day.id} 
                        checked={selectedDays.includes(day.id)} 
                        onCheckedChange={() => handleDayToggle(day.id)}
                      />
                      <Label htmlFor={day.id} className="cursor-pointer">{day.label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeslot">Preferred Time Slot</Label>
                <Select value={timeSlot} onValueChange={setTimeSlot} required>
                  <SelectTrigger id="timeslot">
                    <SelectValue placeholder="Select time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any specific requirements or information you'd like the tutor to know"
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Sending Request..." : "Send Tuition Request"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default RequestTuition;
