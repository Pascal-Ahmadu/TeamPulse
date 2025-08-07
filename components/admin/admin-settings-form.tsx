'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Save } from 'lucide-react';
import { updateSetting } from '@/lib/data';

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
    } catch (error) {
      console.error('Error updating settings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Notifications */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="notifications">Email Notifications</Label>
          <p className="text-sm text-gray-600">
            Send email alerts when team sentiment changes significantly
          </p>
        </div>
        <Switch
          id="notifications"
          checked={settings.notification_enabled === 'true'}
          onCheckedChange={(checked) => handleSetting('notification_enabled', checked.toString())}
        />
      </div>

      {/* Auto Survey Frequency */}
      <div className="space-y-2">
        <Label htmlFor="survey-frequency">Auto Survey Frequency</Label>
        <Select
          value={settings.auto_survey_frequency || 'weekly'}
          onValueChange={(value) => handleSetting('auto_survey_frequency', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="disabled">Disabled</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-gray-600">
          How often to automatically survey team members about their sentiment
        </p>
      </div>

      {/* Team Size Limit */}
      <div className="space-y-2">
        <Label htmlFor="team-size-limit">Team Size Limit</Label>
        <Input
          id="team-size-limit"
          type="number"
          min="1"
          max="1000"
          value={settings.team_size_limit || '50'}
          onChange={(e) => handleSetting('team_size_limit', e.target.value)}
        />
        <p className="text-sm text-gray-600">
          Maximum number of members allowed per team
        </p>
      </div>

      {/* Data Retention */}
      <div className="space-y-2">
        <Label htmlFor="data-retention">Data Retention (days)</Label>
        <Input
          id="data-retention"
          type="number"
          min="30"
          max="3650"
          value={settings.data_retention || '365'}
          onChange={(e) => handleSetting('data_retention', e.target.value)}
        />
        <p className="text-sm text-gray-600">
          How long to keep historical sentiment data (minimum 30 days)
        </p>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          <Save className="h-4 w-4 mr-2" />
          {loading ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </form>
  );
}