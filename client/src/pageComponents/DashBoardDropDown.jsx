import React from 'react';
import { Settings } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const SettingsDropdown = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleProfileSettings = () => {
    navigate('/profileUpdate');
  };

  const handleAccountSettings = () => {
    navigate('/listingsByUser');
  };

  const handlePrivacySettings = () => {
    navigate('/privacy-settings');
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-full justify-start">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem onClick={handleProfileSettings}>
          Update Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleAccountSettings}>
          See all your listings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handlePrivacySettings}>
          Privacy & Security
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-600">
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SettingsDropdown;