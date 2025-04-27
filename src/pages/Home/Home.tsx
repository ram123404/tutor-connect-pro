
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, CheckCircle, Users, Calendar } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-tutor to-student text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Find The Perfect Home Tutor
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Connect with qualified tutors for personalized learning experiences tailored to your needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register">
              <Button size="lg" variant="secondary">
                Get Started
              </Button>
            </Link>
            <Link to="/tutors">
              <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
                Browse Tutors
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-primary/10 rounded-full p-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Find a Tutor</h3>
              <p className="text-muted-foreground">
                Browse through our qualified tutors based on subject, location, and experience.
              </p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-primary/10 rounded-full p-4">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Send a Request</h3>
              <p className="text-muted-foreground">
                Send a tuition request with your specific requirements and schedule.
              </p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-primary/10 rounded-full p-4">
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Start Learning</h3>
              <p className="text-muted-foreground">
                Once your request is accepted, begin your personalized learning journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose TutorConnectPro</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Qualified Tutors</CardTitle>
                <CardDescription>
                  All tutors are thoroughly vetted for qualifications and experience.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span>Experienced educators</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span>Subject matter experts</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span>Verified credentials</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Flexible Scheduling</CardTitle>
                <CardDescription>
                  Choose the timing and frequency that works best for you.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span>Custom schedules</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span>Regular sessions</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span>Extend as needed</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Personalized Learning</CardTitle>
                <CardDescription>
                  Tutoring tailored to your specific learning needs and goals.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span>Customized approach</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span>One-on-one attention</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span>Progress tracking</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Learning?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-muted-foreground">
            Join thousands of students who have improved their academic performance with our qualified tutors.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/register">
              <Button size="lg">
                Sign Up Now
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
                <span className="ml-2 text-2xl font-bold">TutorConnectPro</span>
              </div>
              <p className="max-w-md text-gray-300">
                Connecting students with qualified tutors for personalized learning experiences.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-4">For Students</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-300 hover:text-white">Find Tutors</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white">How It Works</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white">Pricing</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-4">For Tutors</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-300 hover:text-white">Become a Tutor</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white">Resources</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white">Success Stories</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-300 hover:text-white">About Us</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white">Contact</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white">Privacy Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; {new Date().getFullYear()} TutorConnectPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
