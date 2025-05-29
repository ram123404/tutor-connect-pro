
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { bookingAPI } from '@/api';
import { toast } from 'sonner';

const BookingHistory = () => {
  const { data: bookings, isLoading, error } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const response = await bookingAPI.getBookings();
      return response.data.data.bookings;
    },
  });

  if (isLoading) {
    return <div className="animate-pulse">Loading bookings...</div>;
  }

  if (error) {
    toast.error('Failed to load bookings');
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking History</CardTitle>
        <CardDescription>View your past and current bookings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bookings?.map((booking: any) => (
            <div
              key={booking._id}
              className="flex items-center justify-between border-b pb-4 last:border-0"
            >
              <div>
                <h4 className="font-medium">{booking.subject}</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(booking.startDate).toLocaleDateString()}</span>
                  <Clock className="h-4 w-4 ml-2" />
                  <span>{booking.timeSlot}</span>
                </div>
              </div>
              <Badge
                variant={booking.status === 'active' ? 'default' : 'secondary'}
              >
                {booking.status}
              </Badge>
            </div>
          ))}
          {bookings?.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              No bookings found
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingHistory;
