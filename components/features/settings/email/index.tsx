'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  EmailSettingsValue,
  DEFAULT_EMAIL_SETTINGS,
  SETTING_KEYS,
  SETTING_CATEGORIES
} from '../interfaces/settings';
import { SettingsService } from '@/services/settingsService';

export default function EmailSettings() {
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [showSMTPConfig, setShowSMTPConfig] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<EmailSettingsValue>({
    defaultValues: DEFAULT_EMAIL_SETTINGS,
  });

  const emailNotifications = watch('emailNotifications');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const setting = await SettingsService.getSettingByKey(SETTING_KEYS.EMAIL);
      if (setting) {
        const data = setting.value as EmailSettingsValue;
        reset(data);
        if (data.smtpConfig) {
          setShowSMTPConfig(true);
        }
      }
    } catch (error) {
      console.error('Failed to load email settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: EmailSettingsValue) => {
    setSaveStatus('saving');
    try {
      // Remove SMTP config if not shown
      const submitData = { ...data };
      if (!showSMTPConfig) {
        delete submitData.smtpConfig;
      }

      await SettingsService.upsertSetting({
        key: SETTING_KEYS.EMAIL,
        value: submitData,
        category: SETTING_CATEGORIES.COMMUNICATION,
        description: 'Email notification configuration',
      });
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Failed to save email settings:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  if (loading) {
    return <div className="p-6">Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Email Settings</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Configure email notifications and SMTP settings
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Enable Email Notifications */}
        <div className="p-6 border border-gray-300 dark:border-gray-600 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Enable Email Notifications</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Send email notifications for various events
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                {...register('emailNotifications')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        {/* Notification Types */}
        <div className="space-y-4">
          <h3 className="font-semibold">Notification Types</h3>

          <div className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">New Comment Notifications</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Get notified when someone comments on a post
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  {...register('notifyOnNewComment')}
                  disabled={!emailNotifications}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 peer-disabled:opacity-50"></div>
              </label>
            </div>
          </div>

          <div className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">New Post Notifications</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Notify subscribers when a new post is published
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  {...register('notifyOnNewPost')}
                  disabled={!emailNotifications}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 peer-disabled:opacity-50"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Contact Email */}
        <div>
          <label className="block text-sm font-medium mb-2">Contact Email</label>
          <input
            type="email"
            {...register('contactEmail', {
              required: 'Contact email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
            placeholder="admin@blog.com"
          />
          {errors.contactEmail && (
            <p className="mt-1 text-sm text-red-600">{errors.contactEmail.message}</p>
          )}
        </div>

        {/* SMTP Configuration */}
        <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">SMTP Configuration (Optional)</h3>
            <button
              type="button"
              onClick={() => setShowSMTPConfig(!showSMTPConfig)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              {showSMTPConfig ? 'Hide' : 'Configure'}
            </button>
          </div>

          {showSMTPConfig && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">SMTP Host</label>
                  <input
                    type="text"
                    {...register('smtpConfig.host')}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">SMTP Port</label>
                  <input
                    type="number"
                    {...register('smtpConfig.port', { valueAsNumber: true })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                    placeholder="587"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('smtpConfig.secure')}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="ml-2 text-sm font-medium">Use SSL/TLS</label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Username</label>
                <input
                  type="text"
                  {...register('smtpConfig.username')}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                  placeholder="your-email@gmail.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  {...register('smtpConfig.password')}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                  placeholder="Your SMTP password"
                />
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-4 pt-4 border-t">
          <button
            type="submit"
            disabled={!isDirty || saveStatus === 'saving'}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
          </button>

          {saveStatus === 'success' && (
            <span className="text-green-600">Settings saved successfully!</span>
          )}
          {saveStatus === 'error' && (
            <span className="text-red-600">Failed to save settings</span>
          )}
        </div>
      </form>
    </div>
  );
}
