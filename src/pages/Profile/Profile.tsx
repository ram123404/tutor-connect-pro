
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Navigate } from 'react-router-dom';
import { userAPI, tutorAPI } from '@/api';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Pencil, MapPin, Calendar, Book, Clock, DollarSign } from 'lucide-react';

// Schema for basic user info
const userProfileSchema = z.object({
  name: z.string().min(2, { message: 'Name is required' }),
  phoneNumber: z.string().optional(),
  city: z.string().min(1, { message: 'City is required' }),
  area: z.string().min(1, { message: 'Area is required' }),
  profilePic: z.string().optional(),
});

// Additional fields for tutor profile
const tutorProfileSchema = z.object({
  subjects: z.string().min(2, { message: 'Subjects are required' }),
  experience: z.number().min(0, { message: 'Experience must be a positive number' }),
  availability: z.string().min(2, { message: 'Availability information is required' }),
  monthlyRate: z.number().min(1, { message: 'Monthly fee is required' }),
  about: z.string().optional(),
  education: z.string().optional(),
});

type UserProfileFormValues = z.infer<typeof userProfileSchema>;
type TutorProfileFormValues = z.infer<typeof tutorProfileSchema>;

const Profile: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  
  // Form for basic user info
  const userForm = useForm<UserProfileFormValues>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      name: '',
      phoneNumber: '',
      city: '',
      area: '',
      profilePic: '',
    }
  });
  
  // Form for tutor-specific info
  const tutorForm = useForm<TutorProfileFormValues>({
    resolver: zodResolver(tutorProfileSchema),
    defaultValues: {
      subjects: '',
      experience: 0,
      availability: '',
      monthlyRate: 0,
      about: '',
      education: '',
    }
  });
  
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserProfile();
    }
  }, [isAuthenticated]);
  
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getMe();
      const userData = response.data.data.user;
      setProfileData(userData);
      
      // Set user form values
      userForm.setValue('name', userData.name || '');
      userForm.setValue('phoneNumber', userData.phoneNumber || '');
      
      if (userData.address) {
        userForm.setValue('city', userData.address.city || '');
        userForm.setValue('area', userData.address.area || '');
      }
      
      userForm.setValue('profilePic', userData.profilePic || '');
      
      // Set tutor form values if user is a tutor
      if (userData.role === 'tutor' && userData.tutorProfile) {
        const tutorData = userData.tutorProfile;
        tutorForm.setValue('subjects', tutorData.subjects ? tutorData.subjects.join(', ') : '');
        tutorForm.setValue('experience', tutorData.experience || 0);
        tutorForm.setValue('availability', tutorData.availability || '');
        tutorForm.setValue('monthlyRate', tutorData.monthlyRate || 0);
        tutorForm.setValue('about', tutorData.about || '');
        tutorForm.setValue('education', tutorData.education ? tutorData.education.join('\n') : '');
      }
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };
  
  const onUserSubmit = async (data: UserProfileFormValues) => {
    try {
      setSubmitting(true);
      
      // Prepare data for API call
      const profileData = {
        name: data.name,
        phoneNumber: data.phoneNumber,
        address: {
          city: data.city,
          area: data.area,
        },
        profilePic: data.profilePic,
      };
      
      // Update user profile
      await userAPI.updateProfile(profileData);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };
  
  const onTutorSubmit = async (data: TutorProfileFormValues) => {
    if (!user) return;
    
    try {
      setSubmitting(true);
      
      // Prepare data for API call
      const tutorData = {
        subjects: data.subjects.split(',').map(subject => subject.trim()),
        experience: data.experience,
        availability: data.availability,
        monthlyRate: data.monthlyRate,
        about: data.about,
        education: data.education ? data.education.split('\n').filter(line => line.trim() !== '') : [],
      };
      
      // Update tutor profile
      await tutorAPI.updateTutorProfile(user.id, tutorData);
      toast.success('Tutor profile updated successfully');
    } catch (error) {
      toast.error('Failed to update tutor profile');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Get first letter of user's name for avatar fallback
  const getInitials = () => {
    if (!user?.name) return '?';
    return user.name.charAt(0).toUpperCase();
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">
          View and edit your profile information
        </p>
      </div>
      
      {loading ? (
        <div className="flex justify-center p-12">
          <p>Loading profile...</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Profile Summary Card */}
            <Card className="w-full md:w-1/3">
              <CardHeader className="text-center">
                <Avatar className="w-24 h-24 mx-auto">
                  <AvatarImage src={profileData?.profilePic} />
                  <AvatarFallback>{getInitials()}</AvatarFallback>
                </Avatar>
                <CardTitle className="mt-4">{profileData?.name}</CardTitle>
                <CardDescription>
                  {profileData?.role.charAt(0).toUpperCase() + profileData?.role.slice(1)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-sm">
                  <User className="h-4 w-4 mr-2 text-primary" />
                  <span>{profileData?.email}</span>
                </div>
                {profileData?.phoneNumber && (
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-primary" />
                    <span>{profileData.phoneNumber}</span>
                  </div>
                )}
                {profileData?.address && (
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-primary" />
                    <span>
                      {profileData.address.city}, {profileData.address.area}
                    </span>
                  </div>
                )}
                
                {profileData?.role === 'tutor' && profileData?.tutorProfile && (
                  <>
                    <Separator />
                    <div className="space-y-4">
                      <div className="flex items-center text-sm">
                        <Book className="h-4 w-4 mr-2 text-primary" />
                        <span>
                          {profileData.tutorProfile.subjects
                            ? profileData.tutorProfile.subjects.join(', ')
                            : 'No subjects specified'}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-primary" />
                        <span>{profileData.tutorProfile.experience} years experience</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-2 text-primary" />
                        <span>{profileData.tutorProfile.availability}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <DollarSign className="h-4 w-4 mr-2 text-primary" />
                        <span>${profileData.tutorProfile.monthlyRate}/month</span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
            
            {/* Edit Profile Forms */}
            <div className="flex-1">
              <Tabs defaultValue="basic">
                <TabsList className="w-full">
                  <TabsTrigger value="basic" className="flex-1">Basic Information</TabsTrigger>
                  {user?.role === 'tutor' && (
                    <TabsTrigger value="tutor" className="flex-1">Tutor Profile</TabsTrigger>
                  )}
                </TabsList>
                
                <TabsContent value="basic" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Edit Profile</CardTitle>
                      <CardDescription>
                        Update your basic profile information
                      </CardDescription>
                    </CardHeader>
                    <Form {...userForm}>
                      <form onSubmit={userForm.handleSubmit(onUserSubmit)}>
                        <CardContent className="space-y-4">
                          <FormField
                            control={userForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={userForm.control}
                            name="phoneNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your phone number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={userForm.control}
                              name="city"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>City</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter your city" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={userForm.control}
                              name="area"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Area/Neighborhood</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter your area" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={userForm.control}
                            name="profilePic"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Profile Picture URL</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter URL to your profile picture" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </CardContent>
                        <CardFooter>
                          <Button type="submit" disabled={submitting} className="w-full">
                            {submitting ? 'Saving Changes...' : 'Save Changes'}
                          </Button>
                        </CardFooter>
                      </form>
                    </Form>
                  </Card>
                </TabsContent>
                
                {user?.role === 'tutor' && (
                  <TabsContent value="tutor" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Edit Tutor Profile</CardTitle>
                        <CardDescription>
                          Update your tutor-specific information
                        </CardDescription>
                      </CardHeader>
                      <Form {...tutorForm}>
                        <form onSubmit={tutorForm.handleSubmit(onTutorSubmit)}>
                          <CardContent className="space-y-4">
                            <FormField
                              control={tutorForm.control}
                              name="subjects"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Subjects (comma separated)</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g. Mathematics, Physics, Chemistry" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={tutorForm.control}
                                name="experience"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Years of Experience</FormLabel>
                                    <FormControl>
                                      <Input 
                                        type="number" 
                                        min={0} 
                                        {...field}
                                        onChange={e => field.onChange(Number(e.target.value))}
                                        value={field.value}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={tutorForm.control}
                                name="monthlyRate"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Monthly Fee ($)</FormLabel>
                                    <FormControl>
                                      <Input 
                                        type="number" 
                                        min={0} 
                                        {...field}
                                        onChange={e => field.onChange(Number(e.target.value))}
                                        value={field.value}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <FormField
                              control={tutorForm.control}
                              name="availability"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Availability</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g. Weekday evenings, Weekend mornings" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={tutorForm.control}
                              name="about"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>About Me</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      placeholder="Write a short bio about yourself" 
                                      className="min-h-[100px]"
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={tutorForm.control}
                              name="education"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Education (one per line)</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      placeholder="e.g. BSc Mathematics, Harvard University" 
                                      className="min-h-[100px]"
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </CardContent>
                          <CardFooter>
                            <Button type="submit" disabled={submitting} className="w-full">
                              {submitting ? 'Saving Changes...' : 'Save Tutor Profile'}
                            </Button>
                          </CardFooter>
                        </form>
                      </Form>
                    </Card>
                  </TabsContent>
                )}
              </Tabs>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
