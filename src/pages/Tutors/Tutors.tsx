
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, BookOpen, Clock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

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
    availability: 'Mon, Wed, Fri - Evening',
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
    availability: 'Tue, Thu, Sat - Morning',
  },
  {
    id: '3',
    name: 'Ms. Sarah Thompson',
    profilePic: 'https://randomuser.me/api/portraits/women/68.jpg',
    subjects: ['English Literature', 'History'],
    experience: '5 years',
    location: 'New York, Brooklyn',
    rating: 4.5,
    hourlyRate: 30,
    availability: 'Mon, Tue, Wed - Afternoon',
  },
  {
    id: '4',
    name: 'Mr. Michael Brown',
    profilePic: 'https://randomuser.me/api/portraits/men/22.jpg',
    subjects: ['Computer Science', 'Mathematics'],
    experience: '7 years',
    location: 'New York, Queens',
    rating: 4.7,
    hourlyRate: 38,
    availability: 'Wed, Thu, Fri - Evening',
  },
];

const Tutors: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  // Filter tutors based on search query and filters
  const filteredTutors = mockTutors.filter((tutor) => {
    const matchesSearch = 
      tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutor.subjects.some(subject => subject.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSubject = subjectFilter === '' || 
      tutor.subjects.some(subject => subject.toLowerCase().includes(subjectFilter.toLowerCase()));
    
    const matchesLocation = locationFilter === '' || 
      tutor.location.toLowerCase().includes(locationFilter.toLowerCase());
    
    return matchesSearch && matchesSubject && matchesLocation;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Find a Tutor</h1>
        <p className="text-muted-foreground">
          Search for qualified tutors based on subject, location, and availability
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or subject..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Input 
          placeholder="Filter by subject..." 
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
        />

        <Input 
          placeholder="Filter by location..." 
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        />
      </div>

      {/* Tutors Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTutors.map((tutor) => (
          <Card key={tutor.id} className="overflow-hidden">
            <CardHeader className="pb-2">
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
                  <div className="flex items-center text-sm text-amber-500">
                    <Star className="h-3.5 w-3.5 mr-1 fill-amber-500" />
                    <span>{tutor.rating}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <BookOpen className="h-4 w-4 mr-2 text-primary" />
                  <div className="flex flex-wrap gap-1">
                    {tutor.subjects.map((subject) => (
                      <Badge key={subject} variant="secondary" className="font-normal">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-primary" />
                  <span>{tutor.location}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-primary" />
                  <span>{tutor.availability}</span>
                </div>
                <div className="mt-2 text-sm">
                  <span className="font-semibold">${tutor.hourlyRate}/hour</span> • {tutor.experience} experience
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <div className="flex w-full gap-2">
                <Link to={`/tutors/${tutor.id}`} className="w-full">
                  <Button variant="outline" className="w-full">View Profile</Button>
                </Link>
                <Link to={`/request-tuition?tutor=${tutor.id}`} className="w-full">
                  <Button className="w-full">Request Tuition</Button>
                </Link>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Tutors;
