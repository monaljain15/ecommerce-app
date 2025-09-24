import React, { useState, useRef } from 'react';
import { userService } from '../services/userService';
import { Camera, Upload, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface ProfilePictureUploadProps {
    currentAvatar?: string;
    onAvatarChange: (avatarUrl: string) => void;
    className?: string;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
    currentAvatar,
    onAvatarChange,
    className = ''
}) => {
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select a valid image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size must be less than 5MB');
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreviewUrl(e.target?.result as string);
        };
        reader.readAsDataURL(file);

        // Upload file
        uploadFile(file);
    };

    const uploadFile = async (file: File) => {
        setIsUploading(true);
        try {
            // Option 1: Direct upload to backend (handles S3 internally)
            const response = await userService.uploadAvatar(file);

            if (response.success) {
                onAvatarChange(response.avatarUrl);
                toast.success('Profile picture updated successfully!');
            } else {
                throw new Error(response.message);
            }
        } catch (error: any) {
            console.error('Upload error:', error);
            toast.error(error.response?.data?.message || 'Failed to upload profile picture');
        } finally {
            setIsUploading(false);
            setPreviewUrl(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleS3DirectUpload = async (file: File) => {
        setIsUploading(true);
        try {
            // Get S3 upload URL from backend
            const uploadResponse = await userService.getS3UploadUrl(file.name, file.type);

            if (!uploadResponse.success) {
                throw new Error(uploadResponse.message);
            }

            // Upload directly to S3
            const s3Response = await fetch(uploadResponse.uploadUrl, {
                method: 'PUT',
                body: file,
                headers: {
                    'Content-Type': file.type,
                },
            });

            if (!s3Response.ok) {
                throw new Error('Failed to upload to S3');
            }

            // Confirm upload with backend
            const confirmResponse = await userService.confirmS3Upload(uploadResponse.key);

            if (confirmResponse.success) {
                onAvatarChange(confirmResponse.avatarUrl);
                toast.success('Profile picture updated successfully!');
            } else {
                throw new Error(confirmResponse.message);
            }
        } catch (error: any) {
            console.error('S3 upload error:', error);
            toast.error(error.message || 'Failed to upload profile picture');
        } finally {
            setIsUploading(false);
            setPreviewUrl(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleRemoveAvatar = async () => {
        try {
            await userService.deleteAvatar();
            onAvatarChange('');
            toast.success('Profile picture removed successfully!');
        } catch (error: any) {
            console.error('Remove avatar error:', error);
            toast.error(error.response?.data?.message || 'Failed to remove profile picture');
        }
    };

    const openFileDialog = () => {
        fileInputRef.current?.click();
    };

    const displayUrl = previewUrl || currentAvatar;

    return (
        <div className={`relative ${className}`}>
            <div className="relative inline-block">
                {/* Profile Picture */}
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    {displayUrl ? (
                        <img
                            src={displayUrl}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <Camera className="w-12 h-12 text-gray-400" />
                        </div>
                    )}

                    {/* Loading Overlay */}
                    {isUploading && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                        </div>
                    )}
                </div>

                {/* Upload Button */}
                <button
                    onClick={openFileDialog}
                    disabled={isUploading}
                    className="absolute -bottom-2 -right-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 shadow-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Upload className="w-4 h-4" />
                </button>

                {/* Remove Button */}
                {currentAvatar && !isUploading && (
                    <button
                        onClick={handleRemoveAvatar}
                        className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 shadow-lg transition-colors duration-200"
                    >
                        <X className="w-3 h-3" />
                    </button>
                )}
            </div>

            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />

            {/* Upload Instructions */}
            <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                    Click the upload button to change your profile picture
                </p>
                <p className="text-xs text-gray-500 mt-1">
                    Max size: 5MB • Supported: JPG, PNG, GIF
                </p>
            </div>
        </div>
    );
};

export default ProfilePictureUpload;
