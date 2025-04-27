
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, BookOpen, Shield, Check, X, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';

// Mock data for the admin dashboard
const mockStats = {
  totalUsers: 248,
  totalTutors: 83,
  totalStudents: 165,
  totalRequests: 97,
  activeBookings: 64,
  pendingApprovals: 12,
};

const mockPendingApprovals = [
  {
    id: 'tutor1',
    name: 'Prof. Mark Wilson',
    email: 'mark.wilson@example.com',
    role: 'tutor',
    date: '2024-04-27',
  },
  {
    id: 'tutor2',
    name: 'Dr. Sophia Lee',
    email: 'sophia.lee@example.com',
    role: 'tutor',
    date: '2024-04-26',
  },
];

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome, {user?.name}. Here's an overview of your platform.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Total Users</CardTitle>
            <CardDescription>
              All registered users on the platform
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center justify-between">
              <Users className="h-8 w-8 text-primary opacity-80" />
              <div className="text-3xl font-bold text-right">{mockStats.totalUsers}</div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Tutors</span>
                <span>{mockStats.totalTutors}</span>
              </div>
              <Progress value={(mockStats.totalTutors / mockStats.totalUsers) * 100} className="h-2" />
              <div className="flex items-center justify-between text-sm">
                <span>Students</span>
                <span>{mockStats.totalStudents}</span>
              </div>
              <Progress value={(mockStats.totalStudents / mockStats.totalUsers) * 100} className="h-2" />
            </div>
          </CardContent>
          <CardFooter>
            <Link to="/admin/users" className="w-full">
              <Button variant="outline" className="w-full">View All Users</Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Tuition Requests</CardTitle>
            <CardDescription>
              Current and completed requests
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center justify-between">
              <BookOpen className="h-8 w-8 text-primary opacity-80" />
              <div className="text-3xl font-bold text-right">{mockStats.totalRequests}</div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Active</span>
                <span>{mockStats.activeBookings}</span>
              </div>
              <Progress value={(mockStats.activeBookings / mockStats.totalRequests) * 100} className="h-2" />
              <div className="flex items-center justify-between text-sm">
                <span>Pending</span>
                <span>{mockStats.totalRequests - mockStats.activeBookings}</span>
              </div>
              <Progress value={((mockStats.totalRequests - mockStats.activeBookings) / mockStats.totalRequests) * 100} className="h-2" />
            </div>
          </CardContent>
          <CardFooter>
            <Link to="/admin/requests" className="w-full">
              <Button variant="outline" className="w-full">View All Requests</Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Pending Approvals</CardTitle>
            <CardDescription>
              Tutor accounts awaiting approval
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between pb-2">
            <Shield className="h-8 w-8 text-primary opacity-80" />
            <div className="text-3xl font-bold text-right">{mockStats.pendingApprovals}</div>
          </CardContent>
          <CardFooter>
            <Link to="/admin/approvals" className="w-full">
              <Button className="w-full">Review Approvals</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Pending Tutor Approvals</CardTitle>
            <CardDescription>
              Tutor accounts waiting for your review
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockPendingApprovals.map((tutor) => (
                <div key={tutor.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div>
                    <p className="font-medium">{tutor.name}</p>
                    <p className="text-sm text-muted-foreground">{tutor.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="h-8 text-green-600 border-green-600 hover:bg-green-50">
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 text-red-600 border-red-600 hover:bg-red-50">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Link to="/admin/approvals" className="w-full">
              <Button variant="outline" className="w-full">View All Pending Approvals</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
