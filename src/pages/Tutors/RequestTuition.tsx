
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { tutorAPI, requestAPI } from '@/api';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// Define schema for form validation
const requestSchema = z.object({
  subject: z.string().min(2, { message: "Subject is required" }),
  gradeLevel: z.string().min(1, { message: "Grade level is required" }),
  preferredDays: z.array(z.string()).min(1, { message: "Please select at least one day" }),
  preferredTime: z.string().min(1, { message: "Time slot is required" }),
  duration: z.number().min(1, { message: "Duration must be at least 1 month" }).max(12),
  startDate: z.date({ required_error: "Start date is required" }),
  notes: z.string().optional(),
  monthlyFee: z.number().min(1, { message: "Monthly fee is required" }),
});

type RequestFormValues = z.infer<typeof requestSchema>;

const weekdays = [
  { id: "Monday", label: "Monday" },
  { id: "Tuesday", label: "Tuesday" },
  { id: "Wednesday", label: "Wednesday" },
  { id: "Thursday", label: "Thursday" },
  { id: "Friday", label: "Friday" },
  { id: "Saturday", label: "Saturday" },
  { id: "Sunday", label: "Sunday" },
];

const timeSlots = [
  { value: "morning", label: "Morning (8:00 AM - 12:00 PM)" },
  { value: "afternoon", label: "Afternoon (12:00 PM - 4:00 PM)" },
  { value: "evening", label: "Evening (4:00 PM - 8:00 PM)" },
];

const RequestTuition: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [tutor, setTutor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      subject: "",
      gradeLevel: "",
      preferredDays: [],
      preferredTime: "",
      duration: 1,
      startDate: new Date(Date.now() + 86400000), // Tomorrow
      notes: "",
      monthlyFee: 0,
    },
  });

  const tutorId = searchParams.get('tutor');

  useEffect(() => {
    // Check if user is authenticated and is a student
    if (isAuthenticated && user?.role !== 'student') {
      toast.error('Only students can request tuition');
      navigate('/dashboard');
      return;
    }
    
    // If tutorId is provided, fetch tutor details
    if (tutorId) {
      fetchTutor(tutorId);
    } else {
      setLoading(false);
    }
  }, [tutorId, isAuthenticated, user]);

  const fetchTutor = async (id: string) => {
    try {
      setLoading(true);
      const response = await tutorAPI.getTutor(id);
      const tutorData = response.data.data.tutor;
      setTutor(tutorData);
      
      // Pre-fill the form with tutor's data if available
      if (tutorData.tutorProfile) {
        form.setValue('monthlyFee', tutorData.tutorProfile.monthlyRate || 0);
        if (tutorData.tutorProfile.subjects && tutorData.tutorProfile.subjects.length > 0) {
          form.setValue('subject', tutorData.tutorProfile.subjects[0]);
        }
      }
    } catch (error) {
      toast.error('Failed to load tutor information');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: RequestFormValues) => {
    if (!tutorId || !isAuthenticated) {
      toast.error('Missing tutor information or not logged in');
      return;
    }

    try {
      setSubmitting(true);
      
      const requestData = {
        tutorId,
        subject: data.subject,
        gradeLevel: data.gradeLevel,
        preferredDays: data.preferredDays,
        preferredTime: data.preferredTime,
        duration: data.duration,
        startDate: data.startDate,
        monthlyFee: data.monthlyFee,
        notes: data.notes,
      };

      await requestAPI.createRequest(requestData);
      toast.success('Tuition request sent successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send tuition request');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>You need to be logged in as a student to request tuition.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate('/login')} className="w-full">Login</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Request Tuition</h1>
        <Button variant="outline" onClick={() => navigate(-1)}>Go Back</Button>
      </div>

      {tutor && (
        <div className="bg-primary-50 p-4 rounded-lg border border-primary-200 mb-6">
          <h2 className="text-xl font-medium mb-2">Tutor: {tutor.name}</h2>
          {tutor.tutorProfile && (
            <div className="space-y-1 text-sm">
              <p><span className="font-semibold">Subjects:</span> {tutor.tutorProfile.subjects.join(', ')}</p>
              <p><span className="font-semibold">Experience:</span> {tutor.tutorProfile.experience} years</p>
              <p><span className="font-semibold">Availability:</span> {tutor.tutorProfile.availability}</p>
              <p><span className="font-semibold">Expected Fee:</span> ${tutor.tutorProfile.monthlyRate}/month</p>
            </div>
          )}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Tuition Request Form</CardTitle>
          <CardDescription>
            Fill in the details to request tuition from {tutor?.name || 'the tutor'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Subject */}
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Mathematics" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Grade Level */}
                <FormField
                  control={form.control}
                  name="gradeLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grade/Class Level</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 10th Grade" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Preferred Days */}
              <FormField
                control={form.control}
                name="preferredDays"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Preferred Days</FormLabel>
                      <FormDescription>
                        Select the days of the week for tutoring sessions
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {weekdays.map((day) => (
                        <FormField
                          key={day.id}
                          control={form.control}
                          name="preferredDays"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={day.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(day.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, day.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== day.id
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {day.label}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Preferred Time */}
              <FormField
                control={form.control}
                name="preferredTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Time</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a time slot" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {timeSlots.map((slot) => (
                          <SelectItem key={slot.value} value={slot.value}>
                            {slot.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Start Date */}
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={
                                "w-full pl-3 text-left font-normal"
                              }
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Duration */}
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (months)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={1} 
                          max={12} 
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Minimum duration is 1 month
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Monthly Fee */}
              <FormField
                control={form.control}
                name="monthlyFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Fee ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step={1}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Any additional information you'd like to share with the tutor..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Sending Request..." : "Send Tuition Request"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestTuition;
