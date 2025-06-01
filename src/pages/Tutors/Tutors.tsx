
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, BookOpen, Clock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { tutorAPI } from '@/api';
import { toast } from 'sonner';

interface TutorType {
  _id: string;
  name: string;
  profilePic: string;
  address: {
    city: string;
    area: string;
  };
  tutorProfile: {
    subjects: string[];
    experience: number;
    availability: string;
    rating: number;
    monthlyRate: number;
  } | null;
}

const Tutors: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [tutors, setTutors] = useState<TutorType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTutors();
  }, []);

  const fetchTutors = async () => {
    try {
      setLoading(true);
      const response = await tutorAPI.getAllTutors();
      setTutors(response.data.data.tutors);
    } catch (error) {
      toast.error('Failed to fetch tutors');
    } finally {
      setLoading(false);
    }
  };

  // Filter tutors based on search query and filters
  const filteredTutors = tutors.filter((tutor) => {
    const matchesSearch = 
      tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tutor.tutorProfile?.subjects?.some(subject => subject.toLowerCase().includes(searchQuery.toLowerCase())) || false);
    
    const matchesSubject = subjectFilter === '' || 
      (tutor.tutorProfile?.subjects?.some(subject => subject.toLowerCase().includes(subjectFilter.toLowerCase())) || false);
    
    const matchesLocation = locationFilter === '' || 
      (tutor.address && 
        (tutor.address.city?.toLowerCase().includes(locationFilter.toLowerCase()) || 
         tutor.address.area?.toLowerCase().includes(locationFilter.toLowerCase())));
    
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
      {loading ? (
        <div className="flex justify-center p-8">
          <p>Loading tutors...</p>
        </div>
      ) : filteredTutors.length === 0 ? (
        <div className="text-center p-8">
          <p>No tutors found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTutors.map((tutor) => (
            <Card key={tutor._id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full overflow-hidden">
                    <img
                      src={tutor.profilePic || 'https://randomuser.me/api/portraits/men/32.jpg'}
                      alt={tutor.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{tutor.name}</CardTitle>
                    <div className="flex items-center text-sm text-amber-500">
                      <Star className="h-3.5 w-3.5 mr-1 fill-amber-500" />
                      <span>{tutor.tutorProfile?.rating || 'New'}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <BookOpen className="h-4 w-4 mr-2 text-primary" />
                    <div className="flex flex-wrap gap-1">
                      {tutor.tutorProfile?.subjects?.map((subject) => (
                        <Badge key={subject} variant="secondary" className="font-normal">
                          {subject}
                        </Badge>
                      )) || <span className="text-muted-foreground">No subjects listed</span>}
                    </div>
                  </div>
                  {tutor.address && (
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-primary" />
                      <span>{tutor.address.city}, {tutor.address.area}</span>
                    </div>
                  )}
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-primary" />
                    <span>{tutor.tutorProfile?.availability || 'Not specified'}</span>
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="font-semibold">${tutor.tutorProfile?.monthlyRate || 0}/month</span> • {tutor.tutorProfile?.experience || 0} years experience
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <div className="flex w-full gap-2">
                  <Link to={`/tutors/${tutor._id}`} className="w-full">
                    <Button variant="outline" className="w-full">View Profile</Button>
                  </Link>
                  <Link to={`/request-tuition?tutor=${tutor._id}`} className="w-full">
                    <Button className="w-full">Request Tuition</Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tutors;
