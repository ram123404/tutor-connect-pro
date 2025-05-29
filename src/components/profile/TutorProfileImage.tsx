
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, Upload } from 'lucide-react';

interface TutorProfileImageProps {
  currentImage?: string;
  name: string;
  onImageUpdate: (imageUrl: string) => void;
}

const TutorProfileImage: React.FC<TutorProfileImageProps> = ({
  currentImage,
  name,
  onImageUpdate,
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      
      // Create a FileReader to convert the file to base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        onImageUpdate(imageUrl);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar className="h-24 w-24">
          <AvatarImage src={currentImage} alt={name} />
          <AvatarFallback className="text-lg">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>
        
        <div className="absolute -bottom-2 -right-2">
          <Label htmlFor="profile-image-upload" className="cursor-pointer">
            <div className="bg-primary text-primary-foreground rounded-full p-2 hover:bg-primary/90 transition-colors">
              <Camera className="h-4 w-4" />
            </div>
          </Label>
          <Input
            id="profile-image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
            disabled={isUploading}
          />
        </div>
      </div>
      
      <div className="text-center">
        <h3 className="font-semibold">{name}</h3>
        <p className="text-sm text-muted-foreground">Tutor</p>
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        disabled={isUploading}
        onClick={() => document.getElementById('profile-image-upload')?.click()}
      >
        <Upload className="h-4 w-4 mr-2" />
        {isUploading ? 'Uploading...' : 'Upload Photo'}
      </Button>
    </div>
  );
};

export default TutorProfileImage;
