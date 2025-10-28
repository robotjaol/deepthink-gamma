import React, { useState, useRef, useEffect } from 'react';
import Modal from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { Loader2, UploadCloud } from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';
import { User } from '../../../types';

interface ProfilePictureModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentPictureUrl: string;
    onSave: (newPictureUrl: string) => void;
    user: User;
}

const ProfilePictureModal: React.FC<ProfilePictureModalProps> = ({ isOpen, onClose, currentPictureUrl, onSave, user }) => {
    const [fileToUpload, setFileToUpload] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setPreview(currentPictureUrl);
            setError('');
            setFileToUpload(null);
        }
    }, [isOpen, currentPictureUrl]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                setError('File is too large. Please select an image under 2MB.');
                return;
            }
            if (!file.type.startsWith('image/')) {
                setError('Invalid file type. Please select an image.');
                return;
            }

            setFileToUpload(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
                setError('');
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    const handleSave = async () => {
        if (!fileToUpload) return;
        setIsUploading(true);
        setError('');

        try {
            // RLS policy requires path like `{user_id}/{filename}`
            const filePath = `${user.id}/${Date.now()}-${fileToUpload.name}`;

            const { error: uploadError } = await supabase.storage
                .from('profile_pictures')
                .upload(filePath, fileToUpload);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage
                .from('profile_pictures')
                .getPublicUrl(filePath);
            
            if (!data.publicUrl) {
                throw new Error("Could not get public URL for the uploaded image.");
            }

            onSave(data.publicUrl); // Pass the public URL back to the parent
            onClose();

        } catch (err: any) {
            console.error("Error uploading profile picture:", err);
            setError(err.message || 'Failed to upload image. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };
    
    const handleClose = () => {
      setPreview(null);
      setError('');
      setFileToUpload(null);
      onClose();
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="md">
            <h2 className="text-2xl font-bold mb-6 text-center">Change Profile Picture</h2>
            
            <div className="flex justify-center items-center mb-6">
                <img 
                    src={preview || currentPictureUrl} 
                    alt="Profile preview" 
                    className="w-48 h-48 rounded-full object-cover ring-4 ring-light-accent/50 dark:ring-dark-accent/50"
                />
            </div>
            
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/png, image/jpeg, image/gif"
                onChange={handleFileChange}
            />
            
            {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}
            
            <Button variant="secondary" className="w-full mb-4" onClick={triggerFileSelect}>
                <UploadCloud size={20} className="mr-2" />
                Upload New Image
            </Button>
            
            <div className="flex justify-center gap-4">
                <Button variant="ghost" onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSave} disabled={!fileToUpload || isUploading}>
                     {isUploading ? (
                        <><Loader2 size={20} className="mr-2 animate-spin" /> Saving...</>
                    ) : (
                        'Save Changes'
                    )}
                </Button>
            </div>
        </Modal>
    );
};

export default ProfilePictureModal;