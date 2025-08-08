'use client';

import React, { useState } from 'react';
import { Plus, Loader2, CheckCircle, AlertCircle, User, Mail, Heart, Info, X } from 'lucide-react';
import { addMember } from '@/app/actions';
import { Sentiment } from '@/types';

interface AddMemberModalProps {
  teamId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddMemberModal({ teamId, isOpen, onClose, onSuccess }: AddMemberModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [sentiment, setSentiment] = useState<Sentiment>(Sentiment.NEUTRAL);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [isPending, setIsPending] = useState(false);

  // Validation functions
  const validateEmail = (email: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) return 'Email is required';
    if (!emailRegex.test(email.trim())) return 'Please enter a valid email address';
    return null;
  };

  const validateName = (name: string): string | null => {
    if (!name.trim()) return 'Name is required';
    if (name.trim().length < 2) return 'Name must be at least 2 characters long';
    if (name.trim().length > 50) return 'Name must be less than 50 characters';
    return null;
  };

  const handleFieldChange = (field: string, value: string) => {
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    if (field === 'name') setName(value);
    if (field === 'email') setEmail(value);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    const nameError = validateName(name);
    const emailError = validateEmail(email);
    
    if (nameError) newErrors.name = nameError;
    if (emailError) newErrors.email = emailError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setSentiment(Sentiment.NEUTRAL);
    setErrors({});
    setSuccess(false);
  };

  const handleClose = () => {
    if (!isPending) {
      resetForm();
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSuccess(false);
    setIsPending(true);

    try {
      const result = await addMember({
        name: name.trim(),
        email: email.trim(),
        teamId,
        sentiment
      });
      
      if (result && result.success) {
        setSuccess(true);
        
        // Show success message briefly then close
        setTimeout(() => {
          resetForm();
          onClose();
          if (onSuccess) onSuccess();
          // Trigger a page refresh to update the member list
          window.location.reload();
        }, 1500);
      }
      
    } catch (error) {
      console.error('Error creating member:', error);
      setErrors({ 
        submit: error instanceof Error ? error.message : 'Failed to add member. Please try again.' 
      });
    } finally {
      setIsPending(false);
    }
  };

  const isFormValid = name.trim().length >= 2 && validateEmail(email) === null;

  // Sentiment options with consistent styling
  const sentimentOptions = [
    { 
      value: Sentiment.HAPPY, 
      label: 'Happy', 
      emoji: '😊', 
      color: 'from-green-50 to-emerald-50 text-green-700 border-green-200',
      description: 'Positive and engaged'
    },
    { 
      value: Sentiment.NEUTRAL, 
      label: 'Neutral', 
      emoji: '😐', 
      color: 'from-slate-50 to-gray-50 text-slate-700 border-slate-200',
      description: 'Standard baseline'
    },
    { 
      value: Sentiment.SAD, 
      label: 'Concerned', 
      emoji: '😟', 
      color: 'from-red-50 to-rose-50 text-red-700 border-red-200',
      description: 'Needs attention'
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl border border-blue-100 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-blue-100">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Plus className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-medium text-blue-900">Add Team Member</h2>
                <p className="text-sm text-blue-600">Expand your team and track member sentiment</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isPending}
              className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Success Alert */}
            {success && (
              <div className="rounded-lg border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-4 mb-6">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <h4 className="text-sm font-medium text-green-900">Success!</h4>
                    <p className="text-sm text-green-700">Team member has been added successfully.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Alert */}
            {errors.submit && (
              <div className="rounded-lg border border-red-200 bg-gradient-to-r from-red-50 to-rose-50 p-4 mb-6">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <div>
                    <h4 className="text-sm font-medium text-red-900">Error</h4>
                    <p className="text-sm text-red-700">{errors.submit}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <label 
                    htmlFor="member-name" 
                    className="text-sm font-medium text-blue-700 flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    Full Name
                  </label>
                  <input
                    id="member-name"
                    type="text"
                    placeholder="e.g., John Smith, Sarah Johnson..."
                    value={name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    disabled={isPending}
                    className={`w-full h-11 px-4 bg-white rounded-lg border transition-all duration-200 placeholder:text-blue-300 focus:outline-none focus:ring-2 ${
                      errors.name 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                        : 'border-blue-200 focus:border-blue-500 focus:ring-blue-200'
                    } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                    autoComplete="name"
                  />
                  {errors.name && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.name}
                    </p>
                  )}
                  {name.length > 0 && !errors.name && (
                    <p className="text-xs text-blue-500 mt-1">
                      {name.length}/50 characters
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label 
                    htmlFor="member-email" 
                    className="text-sm font-medium text-blue-700 flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    Email Address
                  </label>
                  <input
                    id="member-email"
                    type="email"
                    placeholder="e.g., john.smith@company.com"
                    value={email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    disabled={isPending}
                    className={`w-full h-11 px-4 bg-white rounded-lg border transition-all duration-200 placeholder:text-blue-300 focus:outline-none focus:ring-2 ${
                      errors.email 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                        : 'border-blue-200 focus:border-blue-500 focus:ring-blue-200'
                    } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                    autoComplete="email"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Sentiment Field */}
              <div className="space-y-3">
                <label 
                  htmlFor="member-sentiment" 
                  className="text-sm font-medium text-blue-700 flex items-center gap-2"
                >
                  <Heart className="h-4 w-4" />
                  Initial Sentiment Status
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {sentimentOptions.map((option) => (
                    <div 
                      key={option.value}
                      className={`relative rounded-lg border-2 p-4 cursor-pointer transition-all duration-200 ${
                        sentiment === option.value 
                          ? `bg-gradient-to-r ${option.color} border-current shadow-lg` 
                          : 'bg-white border-blue-200 hover:border-blue-300 hover:shadow-md'
                      } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => !isPending && setSentiment(option.value)}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{option.emoji}</span>
                        <div>
                          <div className={`font-medium text-sm ${
                            sentiment === option.value ? 'text-current' : 'text-blue-900'
                          }`}>
                            {option.label}
                          </div>
                          <div className={`text-xs ${
                            sentiment === option.value ? 'text-current opacity-80' : 'text-blue-500'
                          }`}>
                            {option.description}
                          </div>
                        </div>
                      </div>
                      {sentiment === option.value && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle className="h-4 w-4 text-current" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <div className="flex items-start space-x-3">
                    <Info className="mt-0.5 h-4 w-4 text-blue-600" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-900">Quick Tip</h4>
                      <p className="text-xs text-blue-700 mt-1">
                        This helps establish a baseline for sentiment tracking. You can always update this later through the dashboard.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pt-6 border-t border-blue-100">
                <div className="flex items-center gap-2 text-xs text-blue-500">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span>All fields required</span>
                  </div>
                </div>
                
                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isPending}
                    className="flex-1 sm:flex-none h-11 px-6 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={!isFormValid || isPending}
                    className="flex-1 sm:flex-none h-11 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Adding Member...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Team Member
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}