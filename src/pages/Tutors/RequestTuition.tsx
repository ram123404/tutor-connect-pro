
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { tuitionRequestSchema, type TuitionRequestFormData } from '@/schemas/tuitionRequest';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { requestAPI } from '@/api';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { DatePicker } from "@/components/ui/date-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const RequestTuition = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tutorId = searchParams.get('tutor');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TuitionRequestFormData>({
    resolver: zodResolver(tuitionRequestSchema),
    defaultValues: {
      startDate: new Date(),
    }
  });

  // Update form when date changes
  React.useEffect(() => {
    setValue('startDate', selectedDate);
  }, [selectedDate, setValue]);

  const onSubmit = async (data: TuitionRequestFormData) => {
    if (!tutorId) {
      toast.error('Tutor ID is required');
      return;
    }

    try {
      await requestAPI.createRequest({
        ...data,
        tutorId,
      });
      
      toast.success('Tuition request sent successfully');
      navigate('/requests');
    } catch (error) {
      toast.error('Failed to send tuition request');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[85vh] p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Request Tuition</CardTitle>
            <CardDescription>
              Fill out the form below to send a tuition request
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="e.g., Math, Physics, English"
                  {...register('subject')}
                  className={errors.subject ? "border-red-500" : ""}
                />
                {errors.subject && (
                  <p className="text-red-500 text-sm">{errors.subject.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="gradeLevel">Grade Level</Label>
                <Input
                  id="gradeLevel"
                  placeholder="e.g., 10th Grade, 12th Grade"
                  {...register('gradeLevel')}
                  className={errors.gradeLevel ? "border-red-500" : ""}
                />
                {errors.gradeLevel && (
                  <p className="text-red-500 text-sm">{errors.gradeLevel.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Preferred Days</Label>
                <div className="flex flex-wrap gap-2">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                    <div key={day} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={day.toLowerCase()}
                        value={day}
                        {...register('preferredDays')}
                      />
                      <Label htmlFor={day.toLowerCase()}>{day}</Label>
                    </div>
                  ))}
                </div>
                {errors.preferredDays && (
                  <p className="text-red-500 text-sm">{errors.preferredDays.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="preferredTime">Preferred Time</Label>
                <Input
                  id="preferredTime"
                  placeholder="e.g., 3:00 PM - 5:00 PM"
                  {...register('preferredTime')}
                  className={errors.preferredTime ? "border-red-500" : ""}
                />
                {errors.preferredTime && (
                  <p className="text-red-500 text-sm">{errors.preferredTime.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (months)</Label>
                <Input
                  id="duration"
                  type="number"
                  defaultValue={1}
                  {...register('duration', { valueAsNumber: true })}
                  className={errors.duration ? "border-red-500" : ""}
                />
                {errors.duration && (
                  <p className="text-red-500 text-sm">{errors.duration.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {selectedDate ? (
                        selectedDate.toLocaleDateString()
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="center" side="bottom">
                    <DatePicker
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.startDate && (
                  <p className="text-red-500 text-sm">{errors.startDate.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Input
                  id="notes"
                  placeholder="Any additional information"
                  {...register('notes')}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Send Request'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default RequestTuition;
