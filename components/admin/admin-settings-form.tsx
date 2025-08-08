'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Clock, RefreshCw } from 'lucide-react';
import { updateSettings } from '@/app/actions'; 
import { toast } from 'sonner';

interface AdminSettingsFormProps {
  initialSettings: Record<string, string>;
}

export default function AdminSettingsForm({ initialSettings }: AdminSettingsFormProps) {
  // Provide default values for settings
  const defaultSettings = {
    checkins_enabled: 'false',
    checkin_frequency: 'weekly',
    ...initialSettings
  };
  
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSetting = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Form submitted with settings:', settings); // Debug log
    setLoading(true);

    try {
      // Use the server action to update settings
      await updateSettings({
        checkins_enabled: settings.checkins_enabled || 'false',
        checkin_frequency: settings.checkin_frequency || 'weekly'
      });
      
      router.refresh();
      toast.success('Check-in settings saved successfully', {
        description: 'Changes have been applied to the system',
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to save settings', {
        description: 'Please try again',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSettings(defaultSettings);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Check-in Settings Section */}
      <div className="border border-slate-200 rounded-xl p-6 bg-white/50 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-light text-slate-800">Check-in Settings</h3>
        </div>

        <div className="space-y-6">
          {/* Enable/Disable Check-ins */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50">
            <div className="space-y-1">
              <Label htmlFor="checkins-enabled" className="text-slate-700 font-light">Enable Check-ins</Label>
              <p className="text-sm text-slate-500 font-light">
                Allow team members to submit regular check-ins
              </p>
            </div>
            <Switch
              id="checkins-enabled"
              checked={settings.checkins_enabled === 'true'}
              onCheckedChange={(checked) => handleSetting('checkins_enabled', checked.toString())}
              className="data-[state=checked]:bg-indigo-500"
            />
          </div>

          {/* Check-in Frequency */}
          <div className="p-4 rounded-lg bg-slate-50">
            <Label htmlFor="checkin-frequency" className="text-slate-700 mb-2 block font-light">
              Check-in Frequency
            </Label>
            <Select
              value={settings.checkin_frequency || 'weekly'}
              onValueChange={(value) => handleSetting('checkin_frequency', value)}
              disabled={settings.checkins_enabled !== 'true'}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-slate-500 mt-2 font-light">
              {settings.checkins_enabled !== 'true' 
                ? 'Enable check-ins to configure frequency'
                : 'How often team members should check-in'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
        <Button 
          variant="outline" 
          type="button" 
          onClick={handleReset}
          disabled={loading}
          className="font-light"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button 
          type="submit" 
          disabled={loading}
          className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 shadow-lg font-light"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </form>
  );
}