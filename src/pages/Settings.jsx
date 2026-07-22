import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui';

export default function Settings() {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-600 mt-1">Manage your account and preferences</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Profile settings will be displayed here.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Notification settings will be displayed here.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Security settings will be displayed here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
