
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { userAPI } from '@/api';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const tutorProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  subjects: z.array(z.string()).min(1, 'At least one subject is required'),
  experience: z.number().min(0, 'Experience cannot be negative'),
  availability: z.string().min(1, 'Availability is required'),
  monthlyFee: z.number().min(0, 'Fee cannot be negative'),
  bio: z.string().optional(),
  address: z.object({
    city: z.string().min(2, 'City is required'),
    area: z.string().min(2, 'Area is required'),
  }),
});

type TutorProfileFormData = z.infer<typeof tutorProfileSchema>;

const TutorProfile = () => {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TutorProfileFormData>({
    resolver: zodResolver(tutorProfileSchema),
    defaultValues: {
      name: user?.name || '',
      subjects: user?.subjects || [],
      experience: user?.experience || 0,
      availability: user?.availability || '',
      monthlyFee: user?.monthlyFee || 0,
      bio: user?.bio || '',
      address: {
        city: user?.address?.city || '',
        area: user?.address?.area || '',
      },
    },
  });

  const onSubmit = async (data: TutorProfileFormData) => {
    try {
      await userAPI.updateProfile(data);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your tutor profile information</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                {...register('name')}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subjects">Subjects</Label>
              <Input
                id="subjects"
                placeholder="e.g., Math, Physics (comma-separated)"
                {...register('subjects.0')}
                className={errors.subjects ? "border-red-500" : ""}
              />
              {errors.subjects && (
                <p className="text-red-500 text-sm">{errors.subjects.message}</p>
              )}
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="experience">Experience (years)</Label>
                <Input
                  id="experience"
                  type="number"
                  {...register('experience', { valueAsNumber: true })}
                  className={errors.experience ? "border-red-500" : ""}
                />
                {errors.experience && (
                  <p className="text-red-500 text-sm">{errors.experience.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="monthlyFee">Monthly Fee</Label>
                <Input
                  id="monthlyFee"
                  type="number"
                  {...register('monthlyFee', { valueAsNumber: true })}
                  className={errors.monthlyFee ? "border-red-500" : ""}
                />
                {errors.monthlyFee && (
                  <p className="text-red-500 text-sm">{errors.monthlyFee.message}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="availability">Availability</Label>
              <Input
                id="availability"
                placeholder="e.g., Weekdays evenings, Weekends"
                {...register('availability')}
                className={errors.availability ? "border-red-500" : ""}
              />
              {errors.availability && (
                <p className="text-red-500 text-sm">{errors.availability.message}</p>
              )}
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  {...register('address.city')}
                  className={errors.address?.city ? "border-red-500" : ""}
                />
                {errors.address?.city && (
                  <p className="text-red-500 text-sm">{errors.address.city.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="area">Area</Label>
                <Input
                  id="area"
                  {...register('address.area')}
                  className={errors.address?.area ? "border-red-500" : ""}
                />
                {errors.address?.area && (
                  <p className="text-red-500 text-sm">{errors.address.area.message}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Share information about your teaching style and experience"
                {...register('bio')}
                className={errors.bio ? "border-red-500" : ""}
              />
              {errors.bio && (
                <p className="text-red-500 text-sm">{errors.bio.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default TutorProfile;
