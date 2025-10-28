



import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import ProfilePictureModal from '../../components/dashboard/settings/ProfilePictureModal';
import { X } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { supabase } from '../../lib/supabaseClient';
import { motion } from 'framer-motion';

const UserSettingsPage: React.FC = () => {
    const { user, updateUserProfile } = useAuth();
    const { addNotification } = useNotifications();
    const [name, setName] = useState(user?.name || '');
    const [hobbies, setHobbies] = useState<string[]>(user?.hobbies || []);
    const [newHobby, setNewHobby] = useState('');
    const [instagram, setInstagram] = useState(user?.contacts?.instagram || '');
    const [twitter, setTwitter] = useState(user?.contacts?.twitter || '');
    const [isSaving, setIsSaving] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const handleAddHobby = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && newHobby.trim()) {
            e.preventDefault();
            if (!hobbies.includes(newHobby.trim())) {
                setHobbies([...hobbies, newHobby.trim()]);
            }
            setNewHobby('');
        }
    };
    
    const handleRemoveHobby = (hobbyToRemove: string) => {
        setHobbies(hobbies.filter(hobby => hobby !== hobbyToRemove));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            updateUserProfile({ name, hobbies, contacts: { instagram, twitter } });
            setIsSaving(false);
            addNotification('Profile updated successfully!', 'success', 'Saved!');
        }, 1000);
    };

    const handlePictureSave = async (newPictureUrl: string) => {
        if (!user) {
            addNotification('User not found. Cannot save picture.', 'error');
            return;
        }
        try {
            // Update the user's profile in the database
            const { error } = await supabase
                .from('users')
                .update({ profile_picture_url: newPictureUrl })
                .eq('id', user.id);

            if (error) {
                throw error;
            }

            // Update local state via AuthContext
            updateUserProfile({ profilePictureUrl: newPictureUrl });
            addNotification('Profile picture updated!', 'success');

        } catch (err: any) {
            console.error("Error updating profile picture URL in DB:", err);
            addNotification(err.message || 'Failed to save new profile picture.', 'error');
        }
    };


    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <h1 className="text-4xl font-bold mb-8">Profile Settings</h1>
            <Card>
                <div className="flex flex-col items-center text-center md:flex-row md:text-left md:items-center md:space-x-6 mb-8">
                     <div className="relative group flex-shrink-0 mb-4 md:mb-0">
                        <img src={user?.profilePictureUrl} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Change profile picture"
                        >
                            Change
                        </button>
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold">{user?.name}</h2>
                        <p className="text-gray-500">{user?.email}</p>
                    </div>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input 
                        label="Full Name" 
                        id="name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                    />

                    <div>
                        <Input 
                            label="Add a hobby" 
                            id="hobbies"
                            value={newHobby}
                            onChange={(e) => setNewHobby(e.target.value)}
                            onKeyDown={handleAddHobby}
                            placeholder="Type a hobby and press Enter"
                        />
                        <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                            {hobbies.map(hobby => (
                                <span key={hobby} className="flex items-center bg-light-accent/50 dark:bg-dark-accent/20 px-3 py-1 rounded-full text-sm font-medium">
                                    {hobby}
                                    <button 
                                        type="button" 
                                        onClick={() => handleRemoveHobby(hobby)} 
                                        className="ml-2 text-light-text/50 dark:text-dark-text/50 hover:text-light-text dark:hover:text-dark-text"
                                        aria-label={`Remove ${hobby}`}
                                    >
                                        <X size={14} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                    
                    <Input 
                        label="Instagram Handle" 
                        id="instagram" 
                        value={instagram} 
                        onChange={(e) => setInstagram(e.target.value)} 
                        placeholder="@username"
                    />
                    <Input 
                        label="X Handle" 
                        id="twitter" 
                        value={twitter} 
                        onChange={(e) => setTwitter(e.target.value)}
                        placeholder="@username"
                    />

                    <div>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </Card>

            {user?.profilePictureUrl && (
                <ProfilePictureModal 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    currentPictureUrl={user.profilePictureUrl}
                    onSave={handlePictureSave}
                    user={user}
                />
            )}
        </motion.div>
    );
};

export default UserSettingsPage;