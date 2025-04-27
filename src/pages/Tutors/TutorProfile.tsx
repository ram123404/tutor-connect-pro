
import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Star, 
  Mail,
  BookOpen,
  Briefcase,
  DollarSign,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    availability: 'Mon, Wed, Fri - Evening',
    about: 'I am an experienced mathematics and physics tutor with a Ph.D. in Applied Mathematics. I specialize in helping high school and undergraduate students master difficult concepts through practical examples and clear explanations.',
    education: [
      'Ph.D. in Applied Mathematics, MIT',
      'M.S. in Physics, Stanford University',
      'B.S. in Mathematics, Cornell University'
    ],
    reviews: [
      { id: 1, name: 'Alex J.', rating: 5, comment: 'Prof. Johnson helped my daughter raise her calculus grade from a C to an A in just two months. Excellent tutor!', date: '2024-03-15' },
      { id: 2, name: 'Sarah M.', rating: 4, comment: 'Very knowledgeable and patient. My son now enjoys physics thanks to Prof. Johnson.', date: '2024-02-28' }
    ]
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
    availability: 'Tue, Thu, Sat - Morning',
    about: 'Former university professor with over a decade of teaching experience in Chemistry and Biology. I focus on building strong foundations and critical thinking skills that help students excel in science subjects.',
    education: [
      'Ph.D. in Biochemistry, Harvard University',
      'M.S. in Chemistry, UC Berkeley',
      'B.S. in Biology, UCLA'
    ],
    reviews: [
      { id: 1, name: 'Michael T.', rating: 5, comment: 'Dr. Wilson is amazing! Her teaching methods made organic chemistry much easier to understand.', date: '2024-03-22' },
      { id: 2, name: 'Jennifer K.', rating: 5, comment: 'My daughter got into her dream college thanks to Dr. Wilson\'s preparation for AP Biology.', date: '2024-01-17' }
    ]
  },
  // ... add the other tutors here
];

const TutorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const tutor = mockTutors.find((t) => t.id === id);

  if (!tutor) {
    return <Navigate to="/tutors" replace />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tutor Profile</h1>
        <Link to="/tutors">
          <Button variant="outline">Back to Tutors</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column - Profile Summary */}
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full">
              <img
                src={tutor.profilePic}
                alt={tutor.name}
                className="h-full w-full object-cover"
              />
            </div>
            <CardTitle className="text-xl">{tutor.name}</CardTitle>
            <div className="flex items-center justify-center space-x-1 text-amber-500">
              <Star className="h-4 w-4 fill-amber-500" />
              <span>{tutor.rating} (25 reviews)</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center text-sm">
              <Briefcase className="h-4 w-4 mr-2 text-primary" />
              <span>{tutor.experience} experience</span>
            </div>
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 mr-2 text-primary" />
              <span>{tutor.location}</span>
            </div>
            <div className="flex items-center text-sm">
              <Clock className="h-4 w-4 mr-2 text-primary" />
              <span>{tutor.availability}</span>
            </div>
            <div className="flex items-center text-sm">
              <DollarSign className="h-4 w-4 mr-2 text-primary" />
              <span>${tutor.monthlyRate}/month</span>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              <BookOpen className="h-4 w-4 mr-2 text-primary" />
              {tutor.subjects.map((subject) => (
                <Badge key={subject} variant="secondary" className="font-normal">
                  {subject}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Link to={`/request-tuition?tutor=${tutor.id}`} className="w-full">
              <Button className="w-full">Request Tuition</Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Right Column - Detailed Information */}
        <div className="md:col-span-2">
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="about" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>About {tutor.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{tutor.about}</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="education" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Education & Qualifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 list-disc pl-5">
                    {tutor.education.map((edu, index) => (
                      <li key={index}>{edu}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reviews" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Student Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tutor.reviews?.map((review) => (
                      <div key={review.id} className="border-b pb-4 last:border-0">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{review.name}</div>
                          <div className="flex items-center text-amber-500">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <Star key={i} className="h-3.5 w-3.5 fill-amber-500" />
                            ))}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {review.date}
                        </div>
                        <p className="mt-2">{review.comment}</p>
                      </div>
                    ))}
                    {(!tutor.reviews || tutor.reviews.length === 0) && (
                      <div className="text-center py-8 text-muted-foreground">
                        No reviews yet
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default TutorProfile;
