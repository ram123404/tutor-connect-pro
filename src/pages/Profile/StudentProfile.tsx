import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { userAPI } from '@/api';
import BookingHistory from '@/components/profile/BookingHistory';

const StudentProfile = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    gradeLevel: '',
    subjects: '',
    learningGoals: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        address: typeof user.address === 'string' ? user.address : '',
        gradeLevel: user.gradeLevel || '',
        subjects: Array.isArray(user.subjects) ? user.subjects.join(', ') : '',
        learningGoals: user.learningGoals || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { name, phoneNumber, address, gradeLevel, subjects, learningGoals } = formData;
      const updatedSubjects = subjects.split(',').map(s => s.trim()).filter(s => s);

      await userAPI.updateProfile({
        name,
        phoneNumber,
        address,
        gradeLevel,
        subjects: updatedSubjects,
        learningGoals,
      });

      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-6 w-6" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Student Profile</CardTitle>
          <CardDescription>Update your profile information here.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="gradeLevel">Grade Level</Label>
                <Input
                  type="text"
                  id="gradeLevel"
                  name="gradeLevel"
                  value={formData.gradeLevel}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="subjects">Subjects (comma-separated)</Label>
                <Input
                  type="text"
                  id="subjects"
                  name="subjects"
                  value={formData.subjects}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="learningGoals">Learning Goals</Label>
              <Textarea
                id="learningGoals"
                name="learningGoals"
                value={formData.learningGoals}
                onChange={handleChange}
              />
            </div>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  Updating <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                </>
              ) : (
                'Update Profile'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      <div className="mt-4">
        <BookingHistory />
      </div>
    </div>
  );
};

export default StudentProfile;
