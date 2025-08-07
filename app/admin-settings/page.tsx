
import { getSettings } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminSettingsForm from '@/components/admin/admin-settings-form';

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  const settingsMap = settings.reduce((acc, setting) => {
    acc[setting.key] = setting.value;
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Settings</h1>
        <p className="text-gray-600 mt-2">Configure application settings and preferences</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Application Settings</CardTitle>
            <CardDescription>Configure how TeamPulse operates</CardDescription>
          </CardHeader>
          <CardContent>
            <AdminSettingsForm initialSettings={settingsMap} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}