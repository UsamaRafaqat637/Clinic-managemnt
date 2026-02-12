// components/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('profile');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        specialization: user.specialization || '',
        avatar: user.avatar || '👤'
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await updateProfile(formData);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // In a real app, you would verify current password with backend
      await updateProfile({ 
        passwordUpdatedAt: new Date().toISOString()
      });
      
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to update password' });
    } finally {
      setLoading(false);
    }
  };

  const avatarOptions = [
    { emoji: '👨‍⚕️', label: 'Doctor' },
    { emoji: '👩‍⚕️', label: 'Nurse' },
    { emoji: '👨‍💼', label: 'Admin' },
    { emoji: '👩‍💼', label: 'Receptionist' },
    { emoji: '👤', label: 'Staff' },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold text-white">My Profile</h2>
          <p className="text-gray-400 mt-1">Manage your account settings and preferences</p>
        </div>
        <button
          onClick={logout}
          className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-medium shadow-lg hover:shadow-xl flex items-center justify-center border border-red-500/30"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
          Sign Out
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-[#1c2230] rounded-2xl shadow-xl p-2 border border-gray-700">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'profile'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg border border-blue-500/30'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            👤 Personal Info
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'security'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg border border-blue-500/30'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            🔒 Security
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'activity'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg border border-blue-500/30'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            📊 Activity
          </button>
        </div>
      </div>

      {message.text && (
        <div className={`p-4 rounded-2xl ${
          message.type === 'success' 
            ? 'bg-emerald-500/10 border border-emerald-500/30' 
            : 'bg-red-500/10 border border-red-500/30'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-6 h-6 rounded-full ${
              message.type === 'success' 
                ? 'bg-emerald-500/20 border border-emerald-500/30' 
                : 'bg-red-500/20 border border-red-500/30'
            } flex items-center justify-center`}>
              <span className={message.type === 'success' ? 'text-emerald-400' : 'text-red-400'}>
                {message.type === 'success' ? '✓' : '!'}
              </span>
            </div>
            <p className={message.type === 'success' ? 'text-emerald-300' : 'text-red-300'}>
              {message.text}
            </p>
          </div>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="bg-[#1c2230] rounded-2xl shadow-xl overflow-hidden border border-gray-700">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-900/30 to-blue-800/20 px-8 py-6 border-b border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 rounded-3xl blur-xl group-hover:opacity-30 transition-opacity"></div>
                  <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600/40 to-purple-600/40 backdrop-blur-xl border-2 border-white/20 flex items-center justify-center text-5xl shadow-2xl">
                    {formData.avatar}
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{user.firstName} {user.lastName}</h3>
                  <p className="text-gray-400">{user.specialization || user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
                  <div className="flex items-center mt-2 space-x-3">
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-sm font-semibold border border-emerald-500/30">
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                    <span className="text-sm text-gray-500">
                      Member since {formatDate(user.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`mt-4 md:mt-0 px-6 py-3 rounded-xl font-medium transition-all ${
                  isEditing
                    ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white border border-gray-700'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 border border-blue-500/30'
                }`}
              >
                {isEditing ? 'Cancel Editing' : 'Edit Profile'}
              </button>
            </div>
          </div>

          {/* Profile Form */}
          <div className="p-8">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-3">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-3">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-3">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-2">Email cannot be changed</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-3">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-3">
                    Specialization/Department
                  </label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Cardiology, Administration"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-3">
                    Choose Avatar
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {avatarOptions.map((avatar) => (
                      <button
                        key={avatar.emoji}
                        type="button"
                        onClick={() => setFormData({...formData, avatar: avatar.emoji})}
                        className={`p-3 rounded-xl border transition-all ${
                          formData.avatar === avatar.emoji
                            ? 'border-blue-500 bg-blue-500/10 transform scale-105'
                            : 'border-gray-700 hover:border-blue-500/50 hover:bg-blue-500/5'
                        }`}
                      >
                        <div className="text-2xl">{avatar.emoji}</div>
                        <p className="text-xs text-gray-400 mt-1">{avatar.label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-8 py-3 border border-gray-700 text-gray-300 rounded-xl hover:bg-gray-800 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-lg border border-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-bold text-white mb-4">Personal Information</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between border-b border-gray-700 pb-3">
                        <span className="text-gray-400">Full Name</span>
                        <span className="font-semibold text-white">{user.firstName} {user.lastName}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-700 pb-3">
                        <span className="text-gray-400">Email</span>
                        <span className="font-semibold text-white">{user.email}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-700 pb-3">
                        <span className="text-gray-400">Phone</span>
                        <span className="font-semibold text-white">{user.phone || 'Not provided'}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-700 pb-3">
                        <span className="text-gray-400">Role</span>
                        <span className="font-semibold text-white">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-white mb-4">Professional Details</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between border-b border-gray-700 pb-3">
                        <span className="text-gray-400">Specialization</span>
                        <span className="font-semibold text-white">{user.specialization || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-700 pb-3">
                        <span className="text-gray-400">Member Since</span>
                        <span className="font-semibold text-white">{formatDate(user.createdAt)}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-700 pb-3">
                        <span className="text-gray-400">Last Updated</span>
                        <span className="font-semibold text-white">{formatDate(user.updatedAt) || 'Never'}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-700 pb-3">
                        <span className="text-gray-400">Status</span>
                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-sm font-semibold border border-emerald-500/30">
                          Active
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="bg-[#1c2230] rounded-2xl shadow-xl overflow-hidden border border-gray-700">
          <div className="bg-gradient-to-r from-blue-900/30 to-blue-800/20 px-8 py-6 border-b border-gray-700">
            <h3 className="text-2xl font-bold text-white">Security Settings</h3>
            <p className="text-gray-400">Manage your password and security preferences</p>
          </div>

          <div className="p-8">
            <form onSubmit={handlePasswordSubmit} className="space-y-8">
              <div>
                <h4 className="text-lg font-bold text-white mb-6">Change Password</h4>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-3">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter current password"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-3">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="At least 6 characters"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-3">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700">
                <button
                  type="button"
                  onClick={() => setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  })}
                  className="px-8 py-3 border border-gray-700 text-gray-300 rounded-xl hover:bg-gray-800 transition-colors font-medium"
                >
                  Clear
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-lg border border-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>

            <div className="mt-8 pt-8 border-t border-gray-700">
              <h4 className="text-lg font-bold text-white mb-6">Security Sessions</h4>
              <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-semibold text-white">Current Session</p>
                    <p className="text-sm text-gray-400">This device • {new Date().toLocaleDateString()}</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-sm font-semibold border border-emerald-500/30">
                    Active Now
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  You're currently logged in. Sign out from all other devices if you suspect any unauthorized access.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="bg-[#1c2230] rounded-2xl shadow-xl overflow-hidden border border-gray-700">
          <div className="bg-gradient-to-r from-blue-900/30 to-blue-800/20 px-8 py-6 border-b border-gray-700">
            <h3 className="text-2xl font-bold text-white">Account Activity</h3>
            <p className="text-gray-400">Track your account usage and activities</p>
          </div>

          <div className="p-8">
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 rounded-2xl p-6 border border-blue-500/20">
                <h4 className="text-lg font-bold text-white mb-4">Quick Stats</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">30</div>
                    <div className="text-sm text-gray-400">Days Active</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">156</div>
                    <div className="text-sm text-gray-400">Total Logins</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">Today</div>
                    <div className="text-sm text-gray-400">Last Active</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold text-white mb-6">Recent Activity</h4>
                <div className="space-y-4">
                  {[
                    { action: 'Logged in', time: 'Just now', icon: '🔐' },
                    { action: 'Updated profile information', time: '2 hours ago', icon: '✏️' },
                    { action: 'Viewed patient records', time: '4 hours ago', icon: '📋' },
                    { action: 'Created new prescription', time: '1 day ago', icon: '💊' },
                    { action: 'Generated billing report', time: '2 days ago', icon: '💰' },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700 hover:bg-gray-800/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                          <span className="text-xl">{activity.icon}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-white">{activity.action}</p>
                          <p className="text-sm text-gray-400">{activity.time}</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">System Log</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-700">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-400">Account created on</p>
                    <p className="font-semibold text-white">{formatDate(user.createdAt)}</p>
                  </div>
                  <button className="px-4 py-2 border border-gray-700 text-gray-300 rounded-xl hover:bg-gray-800 transition-colors text-sm">
                    Download Activity Log
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;