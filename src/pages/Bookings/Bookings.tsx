
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { requestAPI } from '@/api';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MapPin, UserCheck, Calendar as CalendarIcon } from 'lucide-react';
import { format, addMonths } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Booking } from '@/types';
import { Navigate, Link } from 'react-router-dom';

const BookingCard: React.FC<{
  booking: any;
  onExtend: (bookingId: string, months: number) => void;
}> = ({ booking, onExtend }) => {
  const [extensionMonths, setExtensionMonths] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleExtend = () => {
    onExtend(booking.id, extensionMonths);
    setIsDialogOpen(false);
  };
  
  // Format days array to readable string
  const formattedDays = booking.daysOfWeek.join(', ');
  
  // Calculate end date
  const endDate = new Date(booking.endDate);
  const startDate = new Date(booking.startDate);
  
  // Calculate if booking is active based on current date and end date
  const isActive = new Date() <= endDate && booking.status === 'active';
  
  return (
    <Card className={`${isActive ? 'border-green-200' : 'border-gray-200'}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{booking.subject}</CardTitle>
            <CardDescription>
              {booking.tutorName}
            </CardDescription>
          </div>
          <Badge variant={isActive ? "default" : "outline"}>
            {isActive ? "Active" : booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pb-2">
        <div className="flex items-center text-sm">
          <CalendarIcon className="h-4 w-4 mr-2 text-primary" />
          <span>
            {format(startDate, 'MMM d, yyyy')} - {format(endDate, 'MMM d, yyyy')}
          </span>
        </div>
        <div className="flex items-center text-sm">
          <Calendar className="h-4 w-4 mr-2 text-primary" />
          <span>{formattedDays}</span>
        </div>
        <div className="flex items-center text-sm">
          <Clock className="h-4 w-4 mr-2 text-primary" />
          <span>{booking.timeSlot}</span>
        </div>
        <div className="font-medium mt-2">
          ${booking.monthlyFee}/month
        </div>
      </CardContent>
      <CardFooter>
        {isActive && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">Extend Booking</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Extend Booking</DialogTitle>
                <DialogDescription>
                  Current end date: {format(endDate, 'MMMM d, yyyy')}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="months" className="text-right">
                    Additional months
                  </Label>
                  <Input
                    id="months"
                    type="number"
                    min={1}
                    max={12}
                    className="col-span-3"
                    value={extensionMonths}
                    onChange={(e) => setExtensionMonths(parseInt(e.target.value))}
                  />
                </div>
                <div className="col-span-4 text-sm">
                  <p className="font-medium">New end date will be:</p>
                  <p>{format(addMonths(endDate, extensionMonths), 'MMMM d, yyyy')}</p>
                  <p className="mt-2">Total additional cost: ${booking.monthlyFee * extensionMonths}</p>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleExtend} disabled={extensionMonths < 1}>
                  Request Extension
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardFooter>
    </Card>
  );
};

const Bookings: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
    }
  }, [isAuthenticated]);
  
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await requestAPI.getRequests();
      
      // Filter out only the accepted requests that would have bookings
      const acceptedRequests = response.data.data.requests.filter(
        (request: any) => request.status === 'accepted'
      );
      
      // Transform requests data to booking format (in a real app, you'd fetch bookings directly)
      const bookingsData = acceptedRequests.map((req: any) => ({
        id: req._id,
        requestId: req._id,
        subject: req.subject,
        tutorName: req.tutor.name,
        tutorId: req.tutor._id,
        studentId: req.student._id,
        startDate: req.startDate,
        endDate: req.endDate,
        daysOfWeek: req.preferredDays,
        timeSlot: req.preferredTime,
        monthlyFee: req.monthlyFee,
        status: 'active',
        createdAt: req.createdAt,
      }));
      
      setBookings(bookingsData);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };
  
  const handleExtendBooking = async (bookingId: string, additionalMonths: number) => {
    try {
      await requestAPI.extendBooking({ bookingId, additionalMonths });
      toast.success('Extension request sent successfully!');
      
      // Update the booking in the local state (this is a simplified version)
      setBookings((prevBookings) =>
        prevBookings.map((booking) => {
          if (booking.id === bookingId) {
            return {
              ...booking,
              endDate: format(addMonths(new Date(booking.endDate), additionalMonths), 'yyyy-MM-dd'),
              extended: true,
            };
          }
          return booking;
        })
      );
    } catch (error) {
      toast.error('Failed to extend booking');
    }
  };
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <p className="text-muted-foreground">
          Manage your ongoing and completed tuition bookings
        </p>
      </div>
      
      {loading ? (
        <div className="flex justify-center p-12">
          <p>Loading bookings...</p>
        </div>
      ) : bookings.length === 0 ? (
        <Card className="text-center p-12">
          <h3 className="text-xl font-medium mb-2">No Bookings Found</h3>
          <p className="text-muted-foreground mb-6">
            You don't have any active or past bookings yet.
          </p>
          <Link to="/tutors">
            <Button>Find a Tutor</Button>
          </Link>
        </Card>
      ) : (
        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {bookings
                .filter(booking => booking.status === 'active' && new Date(booking.endDate) >= new Date())
                .map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onExtend={handleExtendBooking}
                  />
                ))}
              {bookings.filter(booking => booking.status === 'active' && new Date(booking.endDate) >= new Date()).length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p>No active bookings</p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="completed" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {bookings
                .filter(booking => booking.status === 'completed' || new Date(booking.endDate) < new Date())
                .map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onExtend={handleExtendBooking}
                  />
                ))}
              {bookings.filter(booking => booking.status === 'completed' || new Date(booking.endDate) < new Date()).length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p>No completed bookings</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default Bookings;
