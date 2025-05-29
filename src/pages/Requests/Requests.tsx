import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { requestAPI } from '@/api';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Check, X, Clock, ExternalLink } from 'lucide-react';
import { format, isValid, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Navigate, Link } from 'react-router-dom';

// Helper function to safely parse and validate dates
const parseDate = (dateString: string | Date | null | undefined): Date | null => {
  if (!dateString) return null;
  
  let date: Date;
  if (typeof dateString === 'string') {
    // Try parsing as ISO string first, then as regular date
    date = dateString.includes('T') ? parseISO(dateString) : new Date(dateString);
  } else {
    date = new Date(dateString);
  }
  
  return isValid(date) ? date : null;
};

// Helper function to safely format dates
const formatDate = (date: Date | null, formatString: string, fallback: string = 'Invalid date'): string => {
  if (!date || !isValid(date)) return fallback;
  return format(date, formatString);
};

const RequestCard: React.FC<{
  request: any;
  userRole: string;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}> = ({ request, userRole, onAccept, onReject }) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  // Safely parse dates
  const startDate = parseDate(request.startDate);
  const endDate = parseDate(request.endDate);
  const createdDate = parseDate(request.createdAt);
  
  // Format days array to readable string
  const formattedDays = Array.isArray(request.preferredDays) 
    ? request.preferredDays.join(', ') 
    : 'Not specified';
  
  const getStatusColor = () => {
    switch (request.status) {
      case 'pending': return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case 'accepted': return "bg-green-100 text-green-800 border-green-200";
      case 'rejected': return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">
              {request.subject}
              <span className="text-sm font-normal ml-2 text-muted-foreground">
                ({request.gradeLevel})
              </span>
            </CardTitle>
            <CardDescription>
              {userRole === 'student' ? request.tutor.name : request.student.name}
            </CardDescription>
          </div>
          <Badge className={getStatusColor()}>
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pb-2">
        <div className="flex items-center text-sm">
          <Calendar className="h-4 w-4 mr-2 text-primary" />
          <span>
            {formatDate(startDate, 'MMM d, yyyy')} - {formatDate(endDate, 'MMM d, yyyy')}
          </span>
        </div>
        <div className="flex items-center text-sm">
          <Clock className="h-4 w-4 mr-2 text-primary" />
          <span>{formattedDays} · {request.preferredTime}</span>
        </div>
        <div className="font-medium mt-2">
          ${request.monthlyFee}/month
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="w-full">
              View Details
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Details</DialogTitle>
              <DialogDescription>
                {request.subject} - {request.gradeLevel}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-x-4 gap-y-2 text-sm">
                <div className="font-medium">From/To:</div>
                <div className="col-span-2">
                  {userRole === 'student' ? request.tutor.name : request.student.name}
                </div>
                
                <div className="font-medium">Period:</div>
                <div className="col-span-2">
                  {formatDate(startDate, 'MMMM d, yyyy')} - {formatDate(endDate, 'MMMM d, yyyy')}
                </div>
                
                <div className="font-medium">Duration:</div>
                <div className="col-span-2">{request.duration} months</div>
                
                <div className="font-medium">Days:</div>
                <div className="col-span-2">{formattedDays}</div>
                
                <div className="font-medium">Time:</div>
                <div className="col-span-2">{request.preferredTime}</div>
                
                <div className="font-medium">Fee:</div>
                <div className="col-span-2">${request.monthlyFee}/month</div>
                
                <div className="font-medium">Status:</div>
                <div className="col-span-2">
                  <Badge className={getStatusColor()}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </Badge>
                </div>
                
                {request.notes && (
                  <>
                    <div className="font-medium">Notes:</div>
                    <div className="col-span-2">{request.notes}</div>
                  </>
                )}
                
                <div className="font-medium">Requested on:</div>
                <div className="col-span-2">
                  {formatDate(createdDate, 'MMMM d, yyyy')}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        {userRole === 'tutor' && request.status === 'pending' && (
          <div className="flex w-full space-x-2">
            <Button 
              onClick={() => onAccept(request._id)}
              size="sm"
              className="flex-1"
            >
              <Check className="h-4 w-4 mr-1" /> Accept
            </Button>
            <Button 
              onClick={() => onReject(request._id)}
              variant="outline" 
              size="sm"
              className="flex-1"
            >
              <X className="h-4 w-4 mr-1" /> Decline
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

const Requests: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (isAuthenticated) {
      fetchRequests();
    }
  }, [isAuthenticated]);
  
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await requestAPI.getRequests();
      setRequests(response.data.data.requests);
    } catch (error) {
      toast.error('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAcceptRequest = async (id: string) => {
    try {
      await requestAPI.acceptRequest(id);
      toast.success('Request accepted successfully!');
      
      // Update the request in the local state
      setRequests((prevRequests) =>
        prevRequests.map((request) => {
          if (request._id === id) {
            return { ...request, status: 'accepted' };
          }
          return request;
        })
      );
    } catch (error) {
      toast.error('Failed to accept request');
    }
  };
  
  const handleRejectRequest = async (id: string) => {
    try {
      await requestAPI.rejectRequest(id);
      toast.success('Request rejected successfully');
      
      // Update the request in the local state
      setRequests((prevRequests) =>
        prevRequests.map((request) => {
          if (request._id === id) {
            return { ...request, status: 'rejected' };
          }
          return request;
        })
      );
    } catch (error) {
      toast.error('Failed to reject request');
    }
  };
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Get the count of requests by status
  const pendingCount = requests.filter(req => req.status === 'pending').length;
  const acceptedCount = requests.filter(req => req.status === 'accepted').length;
  const rejectedCount = requests.filter(req => req.status === 'rejected').length;
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Tuition Requests</h1>
        <p className="text-muted-foreground">
          Manage your tuition requests
        </p>
      </div>
      
      {loading ? (
        <div className="flex justify-center p-12">
          <p>Loading requests...</p>
        </div>
      ) : requests.length === 0 ? (
        <Card className="text-center p-12">
          <h3 className="text-xl font-medium mb-2">No Requests Found</h3>
          <p className="text-muted-foreground mb-6">
            {user?.role === 'student' 
              ? "You haven't made any tuition requests yet." 
              : "You haven't received any tuition requests yet."}
          </p>
          {user?.role === 'student' && (
            <Link to="/tutors">
              <Button>Find a Tutor</Button>
            </Link>
          )}
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{pendingCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Accepted</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{acceptedCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Rejected</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{rejectedCount}</div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Requests</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="accepted">Accepted</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {requests.map((request) => (
                  <RequestCard
                    key={request._id}
                    request={request}
                    userRole={user?.role || ''}
                    onAccept={handleAcceptRequest}
                    onReject={handleRejectRequest}
                  />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="pending" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {requests
                  .filter((request) => request.status === 'pending')
                  .map((request) => (
                    <RequestCard
                      key={request._id}
                      request={request}
                      userRole={user?.role || ''}
                      onAccept={handleAcceptRequest}
                      onReject={handleRejectRequest}
                    />
                  ))}
                {requests.filter((request) => request.status === 'pending').length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <p>No pending requests</p>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="accepted" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {requests
                  .filter((request) => request.status === 'accepted')
                  .map((request) => (
                    <RequestCard
                      key={request._id}
                      request={request}
                      userRole={user?.role || ''}
                      onAccept={handleAcceptRequest}
                      onReject={handleRejectRequest}
                    />
                  ))}
                {requests.filter((request) => request.status === 'accepted').length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <p>No accepted requests</p>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="rejected" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {requests
                  .filter((request) => request.status === 'rejected')
                  .map((request) => (
                    <RequestCard
                      key={request._id}
                      request={request}
                      userRole={user?.role || ''}
                      onAccept={handleAcceptRequest}
                      onReject={handleRejectRequest}
                    />
                  ))}
                {requests.filter((request) => request.status === 'rejected').length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <p>No rejected requests</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default Requests;
