'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Plus, Loader2, CheckCircle, AlertCircle, User, Mail, Heart } from 'lucide-react';
import { addMember } from '@/app/actions';
import { Sentiment } from '@/types';

interface AddMemberFormProps {
  teamId: string;
}

export default function AddMemberForm({ teamId }: AddMemberFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [sentiment, setSentiment] = useState<Sentiment>(Sentiment.NEUTRAL);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSuccess(false);

    startTransition(async () => {
      try {
        await addMember({
          name: name.trim(),
          email: email.trim(),
          teamId,
          sentiment
        });
        
        // Reset form
        setName('');
        setEmail('');
        setSentiment(Sentiment.NEUTRAL);
        setErrors({});
        setSuccess(true);
        
        // Show success message briefly then refresh
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
        
      } catch (error) {
        console.error('Error creating member:', error);
        setErrors({ 
          submit: error instanceof Error ? error.message : 'Failed to add member. Please try again.' 
        });
      }
    });
  };

  const isFormValid = name.trim().length >= 2 && validateEmail(email) === null;
  const isSubmitting = isPending;

  // Sentiment options with better styling
  const sentimentOptions = [
    { 
      value: Sentiment.HAPPY, 
      label: 'Happy', 
      emoji: '😊', 
      color: 'bg-green-50 text-green-700 border-green-200',
      description: 'Positive and engaged'
    },
    { 
      value: Sentiment.NEUTRAL, 
      label: 'Neutral', 
      emoji: '😐', 
      color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      description: 'Standard baseline'
    },
    { 
      value: Sentiment.SAD, 
      label: 'Concerned', 
      emoji: '😟', 
      color: 'bg-red-50 text-red-700 border-red-200',
      description: 'Needs attention'
    }
  ];

  const currentSentiment = sentimentOptions.find(opt => opt.value === sentiment);

  return (
    <div className="space-y-6">
      {/* Success Alert */}
      {success && (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription className="font-medium">
            Team member added successfully!
          </AlertDescription>
        </Alert>
      )}

      {/* Error Alert */}
      {errors.submit && (
        <Alert className="border-red-200 bg-red-50 text-red-800">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {errors.submit}
          </AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Name Field */}
          <div className="space-y-2">
            <Label 
              htmlFor="member-name" 
              className="text-sm font-medium text-slate-700 flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              Full Name
            </Label>
            <Input
              id="member-name"
              type="text"
              placeholder="e.g., John Smith, Sarah Johnson..."
              value={name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              disabled={isSubmitting}
              className={`h-11 bg-white transition-all duration-200 ${
                errors.name 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                  : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/20'
              }`}
              autoComplete="name"
            />
            {errors.name && (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.name}
              </p>
            )}
            {name.length > 0 && !errors.name && (
              <p className="text-xs text-slate-500 mt-1">
                {name.length}/50 characters
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label 
              htmlFor="member-email" 
              className="text-sm font-medium text-slate-700 flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              Email Address
            </Label>
            <Input
              id="member-email"
              type="email"
              placeholder="e.g., john.smith@company.com"
              value={email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              disabled={isSubmitting}
              className={`h-11 bg-white transition-all duration-200 ${
                errors.email 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                  : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/20'
              }`}
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
          <Label 
            htmlFor="member-sentiment" 
            className="text-sm font-medium text-slate-700 flex items-center gap-2"
          >
            <Heart className="h-4 w-4" />
            Initial Sentiment Status
          </Label>
          
          <Select
            value={sentiment}
            onValueChange={(value) => setSentiment(value as Sentiment)}
            disabled={isSubmitting}
          >
            <SelectTrigger className="h-11 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20">
              <SelectValue>
                {currentSentiment && (
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{currentSentiment.emoji}</span>
                    <span>{currentSentiment.label}</span>
                    <Badge variant="secondary" className={`text-xs ${currentSentiment.color}`}>
                      {currentSentiment.description}
                    </Badge>
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {sentimentOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-3 py-1">
                    <span className="text-lg">{option.emoji}</span>
                    <div className="flex flex-col">
                      <span className="font-medium">{option.label}</span>
                      <span className="text-xs text-slate-500">{option.description}</span>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <p className="text-xs text-slate-500 leading-relaxed">
            💡 <span className="font-medium">Tip:</span> This helps establish a baseline for sentiment tracking. You can always update this later.
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Required fields</span>
            </div>
          </div>
          
          <Button 
            type="submit" 
            disabled={!isFormValid || isSubmitting}
            className="w-full sm:w-auto h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
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
          </Button>
        </div>
      </form>

      {/* Form Helper */}
      {!success && !errors.submit && (
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
          <h4 className="text-sm font-medium text-slate-900 mb-2">Quick Add Tips:</h4>
          <ul className="text-xs text-slate-600 space-y-1">
            <li>• Use work email addresses for better organization</li>
            <li>• Initial sentiment helps track changes over time</li>
            <li>• Press Tab to navigate between fields quickly</li>
          </ul>
        </div>
      )}
    </div>
  );
}