
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
import { StudentProfile as StudentProfileType } from '@/types';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phoneNumber: z.string().min(10, 'Please enter a valid phone number'),
  address: z.object({
    city: z.string().min(2, 'City is required'),
    area: z.string().min(2, 'Area is required'),
  }),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const StudentProfile = () => {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      phoneNumber: (user as StudentProfileType)?.phoneNumber || '',
      address: {
        city: (user as StudentProfileType)?.address?.city || '',
        area: (user as StudentProfileType)?.address?.area || '',
      },
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
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
          <CardDescription>Update your personal information</CardDescription>
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
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                {...register('phoneNumber')}
                className={errors.phoneNumber ? "border-red-500" : ""}
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>
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

export default StudentProfile;
