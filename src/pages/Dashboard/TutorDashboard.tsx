
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Wallet, Clock, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { requestAPI, bookingAPI } from '@/api';
import { toast } from 'sonner';

const TutorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [requestsResponse, bookingsResponse] = await Promise.all([
        requestAPI.getRequests(),
        bookingAPI.getBookings()
      ]);
      
      setRequests(requestsResponse.data.data.requests);
      setBookings(bookingsResponse.data.data.bookings);
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await requestAPI.acceptRequest(requestId);
      toast.success('Request accepted successfully!');
      fetchData(); // Refresh data
    } catch (error) {
      toast.error('Failed to accept request');
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await requestAPI.rejectRequest(requestId);
      toast.success('Request rejected successfully!');
      fetchData(); // Refresh data
    } catch (error) {
      toast.error('Failed to reject request');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const pendingRequests = requests.filter(req => req.status === 'pending');
  const activeBookings = bookings.filter(booking => booking.status === 'active');
  const upcomingSessions = activeBookings.slice(0, 5); // Show next 5 sessions

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
            <div className="text-3xl font-bold text-primary">{pendingRequests.length}</div>
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
            <div className="text-3xl font-bold text-primary">{activeBookings.length}</div>
          </CardContent>
          <CardFooter>
            <Link to="/bookings">
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
            <div className="text-3xl font-bold text-primary">{upcomingSessions.length}</div>
          </CardContent>
          <CardFooter>
            <Link to="/bookings">
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
              {pendingRequests.slice(0, 3).map((request) => (
                <div key={request._id} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div>
                    <p className="font-medium">{request.subject} - {request.gradeLevel}</p>
                    <p className="text-sm text-muted-foreground">{request.student.name}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-8 text-green-600 border-green-600 hover:bg-green-50"
                      onClick={() => handleAcceptRequest(request._id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-8 text-red-600 border-red-600 hover:bg-red-50"
                      onClick={() => handleRejectRequest(request._id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {pendingRequests.length === 0 && (
                <p className="text-center text-muted-foreground py-4">No pending requests</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Link to="/requests">
              <Button variant="outline" className="w-full">View All Requests</Button>
            </Link>
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
              {upcomingSessions.map((booking) => (
                <div key={booking._id} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div>
                    <p className="font-medium">{booking.subject}</p>
                    <p className="text-sm text-muted-foreground">{booking.student.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{booking.timeSlot}</p>
                    <p className="text-xs text-muted-foreground text-right">
                      {booking.daysOfWeek.join(', ')}
                    </p>
                  </div>
                </div>
              ))}
              {upcomingSessions.length === 0 && (
                <p className="text-center text-muted-foreground py-4">No upcoming sessions</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Link to="/bookings">
              <Button variant="outline" className="w-full">View Schedule</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default TutorDashboard;
