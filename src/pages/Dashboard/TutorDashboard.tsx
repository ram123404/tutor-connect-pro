
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Wallet, Clock, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data for the tutor dashboard
const mockRequests = [
  {
    id: 'req1',
    studentName: 'Alex Johnson',
    subject: 'Mathematics',
    grade: '10th Grade',
    status: 'pending',
    date: '2024-04-28',
  },
  {
    id: 'req2',
    studentName: 'Sarah Miller',
    subject: 'Physics',
    grade: '12th Grade',
    status: 'pending',
    date: '2024-04-25',
  },
];

const mockBookings = [
  {
    id: 'book1',
    studentName: 'Michael Brown',
    subject: 'Chemistry',
    nextSession: '2024-04-29, 4:00 PM',
    remainingSessions: 12,
  },
  {
    id: 'book2',
    studentName: 'Emma Davis',
    subject: 'Biology',
    nextSession: '2024-04-30, 5:30 PM',
    remainingSessions: 8,
  },
];

const TutorDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
        <p className="text-muted-foreground">Here's an overview of your tutoring activities</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Pending Requests</CardTitle>
            <CardDescription>
              Tuition requests awaiting your response
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center pb-2">
            <div className="text-3xl font-bold text-primary">{mockRequests.length}</div>
          </CardContent>
          <CardFooter>
            <Link to="/requests">
              <Button className="w-full">View Requests</Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Active Students</CardTitle>
            <CardDescription>
              Students you are currently tutoring
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center pb-2">
            <div className="text-3xl font-bold text-primary">{mockBookings.length}</div>
          </CardContent>
          <CardFooter>
            <Link to="/students">
              <Button className="w-full">View Students</Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Upcoming Sessions</CardTitle>
            <CardDescription>
              Your scheduled tutoring sessions
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center pb-2">
            <div className="text-3xl font-bold text-primary">{mockBookings.length}</div>
          </CardContent>
          <CardFooter>
            <Link to="/schedule">
              <Button className="w-full">View Schedule</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Tuition Requests</CardTitle>
            <CardDescription>
              Recent tuition requests from students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div>
                    <p className="font-medium">{request.subject} - {request.grade}</p>
                    <p className="text-sm text-muted-foreground">{request.studentName}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="h-8 text-green-600 border-green-600 hover:bg-green-50">
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 text-red-600 border-red-600 hover:bg-red-50">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View All Requests</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Upcoming Sessions</CardTitle>
            <CardDescription>
              Your scheduled tutoring sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div>
                    <p className="font-medium">{booking.subject}</p>
                    <p className="text-sm text-muted-foreground">{booking.studentName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{booking.nextSession}</p>
                    <p className="text-xs text-muted-foreground text-right">
                      {booking.remainingSessions} sessions remaining
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View Schedule</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default TutorDashboard;
