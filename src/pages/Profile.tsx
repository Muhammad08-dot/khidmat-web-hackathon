import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Phone, MapPin, Briefcase, Star, Clock, LogOut, ChevronLeft, Camera, Repeat } from 'lucide-react';
import { Card, Avatar } from '../components/ui';
import { TierBadge } from '../components/ui/TierBadge';
import { uploadProfilePhoto } from '../services/firebase';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, userProfile, logout, updateProfile } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [switchingRole, setSwitchingRole] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth');
    } catch (err) {
      console.error("Failed to log out:", err);
    }
  };

  const handleSwitchRole = async () => {
    if (!userProfile) return;
    setSwitchingRole(true);
    const targetRole = userProfile.role === 'provider' ? 'customer' : 'provider';
    
    try {
      const updates: any = { role: targetRole };
      if (targetRole === 'provider' && !userProfile.category) {
        updates.category = 'Handyman';
        updates.tier = userProfile.tier || 'Silver';
        updates.rating = userProfile.rating || 4.9;
        updates.totalJobs = userProfile.totalJobs || 12;
        updates.basePrice = userProfile.basePrice || 800;
        updates.available = true;
      }
      
      await updateProfile(updates);
      navigate('/');
    } catch (err) {
      console.error("Failed to switch role:", err);
    } finally {
      setSwitchingRole(false);
    }
  };

  const handleEditPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      const fileType = file.type || '';
      const isImg = fileType.startsWith('image/') || /\.(jpe?g|png|webp|heic)$/i.test(file.name);
      if (!isImg) {
        setPhotoError('Please select a valid image file (JPG, PNG, WEBP, HEIC).');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setPhotoError('Image file size should be less than 2MB.');
        return;
      }
      
      setUploading(true);
      setPhotoError(null);
      try {
        const url = await uploadProfilePhoto(user.uid, file);
        await updateProfile({ photoURL: url });
      } catch (err: any) {
        console.error("Photo upload error:", err);
        setPhotoError('Failed to upload profile photo. Please try again.');
      } finally {
        setUploading(false);
      }
    }
  };

  if (!userProfile) {
    return (
      <div className="pt-28 pb-28 px-4 max-w-xl mx-auto text-center">
        <p className="text-gray-500">Loading profile information...</p>
      </div>
    );
  }

  const isProvider = userProfile.role === 'provider';

  return (
    <div className="pt-28 pb-28 md:pb-12 px-margin-mobile md:px-margin-desktop max-w-xl mx-auto w-full">
      {/* Header back button */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full border border-gray-200 dark:border-slate-800 flex items-center justify-center text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your Profile</h1>
      </div>

      <div className="space-y-6">
        {/* Main Profile Info Card */}
        <Card className="flex flex-col items-center text-center p-6 md:p-8">
          <div className="relative group mb-4">
            <Avatar src={userProfile.photoURL} name={userProfile.name} className="w-24 h-24 shadow-inner" />
            <label className="absolute inset-0 bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer select-none text-[10px] font-semibold">
              <Camera className="w-5 h-5 mb-0.5" />
              {uploading ? 'Uploading...' : 'Edit Photo'}
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleEditPhoto}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>
          {photoError && (
            <p className="text-xs text-red-500 mb-2 font-medium">{photoError}</p>
          )}
          
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 justify-center">
            {userProfile.name}
            {isProvider && userProfile.tier && (
              <TierBadge tier={userProfile.tier} />
            )}
          </h2>
          <div className="mt-2 flex items-center gap-2">
            <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
              isProvider
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-300 dark:border-blue-800'
            }`}>
              {isProvider ? '🛠️ Active as Service Provider' : '🛒 Active as Client / Customer'}
            </span>
          </div>

          {isProvider && userProfile.bio && (
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-4 max-w-md italic leading-relaxed">
              "{userProfile.bio}"
            </p>
          )}
        </Card>

        {/* Dual-Role Switcher Card */}
        <Card className="p-6 border border-emerald-500/20 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 dark:from-emerald-950/20 dark:to-teal-950/20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Dual-Profile Marketplace</p>
              <h3 className="text-base font-bold text-gray-900 dark:text-white mt-0.5">
                {isProvider ? 'Switch to Customer View' : 'Switch to Provider Dashboard'}
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                {isProvider
                  ? 'Browse 21 categories, use voice search, and hire other verified experts.'
                  : 'Manage incoming job leads, track PKR earnings, and toggle your live availability.'}
              </p>
            </div>
            <button
              onClick={handleSwitchRole}
              disabled={switchingRole}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold shadow-soft transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <Repeat className="w-4 h-4" />
              <span>{switchingRole ? 'Switching...' : isProvider ? 'Switch to Customer' : 'Switch to Provider'}</span>
            </button>
          </div>
        </Card>

        {/* Account Details Card */}
        <Card className="p-6 md:p-8">
          <h3 className="text-sm font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-4">Contact Information</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-sm">
              <Mail className="w-5 h-5 text-gray-400 shrink-0" />
              <div>
                <p className="text-xs text-gray-400 dark:text-slate-500 font-semibold">Email Address</p>
                <p className="font-medium text-gray-800 dark:text-slate-200">{userProfile.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <Phone className="w-5 h-5 text-gray-400 shrink-0" />
              <div>
                <p className="text-xs text-gray-400 dark:text-slate-500 font-semibold">Phone Number</p>
                <p className="font-medium text-gray-800 dark:text-slate-200">{userProfile.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
              <div>
                <p className="text-xs text-gray-400 dark:text-slate-500 font-semibold">City / Region</p>
                <p className="font-medium text-gray-800 dark:text-slate-200">{userProfile.city}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Provider metrics card */}
        {isProvider && (
          <Card className="p-6 md:p-8">
            <h3 className="text-sm font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-4">Business Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-sm">
                <Briefcase className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400 font-semibold">Specialty</p>
                  <p className="font-bold text-gray-800 dark:text-slate-200">{userProfile.category}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <Star className="w-5 h-5 text-amber-500" />
                <div>
                  <p className="text-xs text-gray-400 font-semibold">Average Rating</p>
                  <p className="font-bold text-gray-800 dark:text-slate-200">{userProfile.rating?.toFixed(1) || '5.0'} / 5.0</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400 font-semibold">Total Jobs Done</p>
                  <p className="font-bold text-gray-800 dark:text-slate-200">{userProfile.totalJobs || 0} jobs</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <span className="font-bold text-gray-400 text-base ml-1">Rs.</span>
                <div>
                  <p className="text-xs text-gray-400 font-semibold">Hourly Base Rate</p>
                  <p className="font-bold text-[#006e2f] dark:text-[#6bff8f]">{userProfile.basePrice} PKR/hr</p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-semibold py-4 rounded-xl shadow-soft transition-all flex items-center justify-center gap-2 text-sm"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out of Account</span>
        </button>
      </div>
    </div>
  );
};

export default Profile;
