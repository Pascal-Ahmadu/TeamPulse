'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Save, Shield, Bell, Users, Database, RefreshCw } from 'lucide-react';
import { updateSetting } from '@/lib/data';
import { toast } from 'sonner';

interface AdminSettingsFormProps {
  initialSettings: Record<string, string>;
}

export default function AdminSettingsForm({ initialSettings }: AdminSettingsFormProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSetting = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update all settings
      for (const [key, value] of Object.entries(settings)) {
        await updateSetting(key, value);
      }
      router.refresh();
      toast.success('Settings saved successfully', {
        description: 'All changes have been applied to the system',
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to save settings', {
        description: 'Please check your changes and try again',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Section 1: Notification Settings */}
      <div className="border border-slate-200 rounded-xl p-6 bg-white/50 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
            <Bell className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">Notification Settings</h3>
        </div>

        <div className="space-y-6">
          {/* Email Notifications */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50">
            <div className="space-y-1">
              <Label htmlFor="notifications" className="text-slate-700">Email Notifications</Label>
              <p className="text-sm text-slate-500">
                Send email alerts when team sentiment changes significantly
              </p>
            </div>
            <Switch
              id="notifications"
              checked={settings.notification_enabled === 'true'}
              onCheckedChange={(checked) => handleSetting('notification_enabled', checked.toString())}
              className="data-[state=checked]:bg-blue-500"
            />
          </div>

          {/* Notification Threshold */}
          <div className="p-4 rounded-lg bg-slate-50">
            <Label htmlFor="notification-threshold" className="text-slate-700 mb-2 block">
              Notification Threshold
            </Label>
            <Select
              value={settings.notification_threshold || '0.5'}
              onValueChange={(value) => handleSetting('notification_threshold', value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select threshold" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.3">Small Changes (0.3+)</SelectItem>
                <SelectItem value="0.5">Moderate Changes (0.5+)</SelectItem>
                <SelectItem value="0.8">Large Changes (0.8+)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-slate-500 mt-2">
              Minimum sentiment change required to trigger notifications
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Survey Settings */}
      <div className="border border-slate-200 rounded-xl p-6 bg-white/50 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
            <Users className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">Survey Settings</h3>
        </div>

        <div className="space-y-6">
          {/* Auto Survey Frequency */}
          <div className="p-4 rounded-lg bg-slate-50">
            <Label htmlFor="survey-frequency" className="text-slate-700 mb-2 block">
              Auto Survey Frequency
            </Label>
            <Select
              value={settings.auto_survey_frequency || 'weekly'}
              onValueChange={(value) => handleSetting('auto_survey_frequency', value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="biweekly">Bi-Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-slate-500 mt-2">
              How often to automatically survey team members
            </p>
          </div>

          {/* Team Size Limit */}
          <div className="p-4 rounded-lg bg-slate-50">
            <Label htmlFor="team-size-limit" className="text-slate-700 mb-2 block">
              Team Size Limit
            </Label>
            <Input
              id="team-size-limit"
              type="number"
              min="1"
              max="1000"
              value={settings.team_size_limit || '50'}
              onChange={(e) => handleSetting('team_size_limit', e.target.value)}
              className="w-[180px]"
            />
            <p className="text-sm text-slate-500 mt-2">
              Maximum number of members allowed per team
            </p>
          </div>
        </div>
      </div>

      {/* Section 3: Data Settings */}
      <div className="border border-slate-200 rounded-xl p-6 bg-white/50 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg">
            <Database className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">Data Settings</h3>
        </div>

        <div className="space-y-6">
          {/* Data Retention */}
          <div className="p-4 rounded-lg bg-slate-50">
            <Label htmlFor="data-retention" className="text-slate-700 mb-2 block">
              Data Retention (days)
            </Label>
            <Input
              id="data-retention"
              type="number"
              min="30"
              max="3650"
              value={settings.data_retention || '365'}
              onChange={(e) => handleSetting('data_retention', e.target.value)}
              className="w-[180px]"
            />
            <p className="text-sm text-slate-500 mt-2">
              How long to keep historical data (minimum 30 days)
            </p>
          </div>

          {/* Data Export */}
          <div className="p-4 rounded-lg bg-slate-50">
            <Label htmlFor="data-export" className="text-slate-700 mb-2 block">
              Auto Export Frequency
            </Label>
            <Select
              value={settings.data_export_frequency || 'monthly'}
              onValueChange={(value) => handleSetting('data_export_frequency', value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-slate-500 mt-2">
              How often to automatically backup sentiment data
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
        <Button 
          variant="outline" 
          type="button" 
          onClick={() => router.refresh()}
          disabled={loading}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button 
          type="submit" 
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg"
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
              Save All Settings
            </>
          )}
        </Button>
      </div>
    </form>
  );
}