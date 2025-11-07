'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  ContentSettingsValue,
  DEFAULT_CONTENT_SETTINGS,
  SETTING_KEYS,
  SETTING_CATEGORIES
} from '../interfaces/settings';
import { SettingsService } from '@/services/settingsService';

export default function ContentSettings() {
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ContentSettingsValue>({
    defaultValues: DEFAULT_CONTENT_SETTINGS,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const setting = await SettingsService.getSettingByKey(SETTING_KEYS.CONTENT);
      if (setting) {
        reset(setting.value as ContentSettingsValue);
      }
    } catch (error) {
      console.error('Failed to load content settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ContentSettingsValue) => {
    setSaveStatus('saving');
    try {
      await SettingsService.upsertSetting({
        key: SETTING_KEYS.CONTENT,
        value: data,
        category: SETTING_CATEGORIES.CONTENT,
        description: 'Content display configuration',
      });
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Failed to save content settings:', error);
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
        <h2 className="text-2xl font-bold">Content Settings</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Configure how content is displayed on your blog
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Posts Per Page */}
        <div>
          <label className="block text-sm font-medium mb-2">Posts Per Page</label>
          <input
            type="number"
            {...register('postsPerPage', {
              required: 'Posts per page is required',
              min: { value: 1, message: 'Minimum 1 post' },
              max: { value: 50, message: 'Maximum 50 posts' }
            })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
            min={1}
            max={50}
          />
          {errors.postsPerPage && (
            <p className="mt-1 text-sm text-red-600">{errors.postsPerPage.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
            Number of posts to display per page (1-50)
          </p>
        </div>

        {/* Display Options */}
        <div className="space-y-4">
          <h3 className="font-semibold">Display Options</h3>

          {/* Show Featured Image */}
          <div className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Show Featured Image</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Display featured image at the top of blog posts
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  {...register('showFeaturedImage')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          {/* Show Author Info */}
          <div className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Show Author Information</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Display author name and avatar on posts
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  {...register('showAuthorInfo')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          {/* Show Publish Date */}
          <div className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Show Publish Date</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Display when the post was published
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  {...register('showPublishDate')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          {/* Show Reading Time */}
          <div className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Show Reading Time</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Display estimated reading time for each post
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  {...register('showReadingTime')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
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
