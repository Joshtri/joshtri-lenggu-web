"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button, Card, CardBody, Divider } from "@heroui/react";
import {
  EmailSettingsValue,
  DEFAULT_EMAIL_SETTINGS,
  SETTING_KEYS,
  SETTING_CATEGORIES,
} from "../interfaces/settings";
import { SettingsService } from "@/services/settingsService";
import { SkeletonCard } from "@/components/ui/Skeletons/SkeletonCard";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import {
  TextInput,
  NumberInput,
  SwitchInput,
  CheckboxInput,
} from "@/components/ui/Inputs";

export default function EmailSettings() {
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");
  const [showSMTPConfig, setShowSMTPConfig] = useState(false);

  const methods = useForm<EmailSettingsValue>({
    defaultValues: DEFAULT_EMAIL_SETTINGS,
  });

  const {
    handleSubmit,
    reset,
    watch,
    formState: { isDirty },
  } = methods;

  const emailNotifications = watch("emailNotifications");

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
      console.error("Failed to load email settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: EmailSettingsValue) => {
    setSaveStatus("saving");
    try {
      const submitData = { ...data };
      if (!showSMTPConfig) {
        delete submitData.smtpConfig;
      }

      await SettingsService.upsertSetting({
        key: SETTING_KEYS.EMAIL,
        value: submitData as unknown as JSON,
        category: SETTING_CATEGORIES.COMMUNICATION,
        description: "Email notification configuration",
      });
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (error) {
      console.error("Failed to save email settings:", error);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  if (loading) {
    return <SkeletonCard hasFooter={false} hasHeader={false} rows={20} />;
  }


  return (
    <FormProvider {...methods}>
      <div className="space-y-4 md:space-y-6">
        <div>
          <Heading className="text-xl md:text-2xl font-bold">
            Email Settings
          </Heading>
          <Text className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
            Configure email notifications and SMTP settings
          </Text>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
          {/* Enable Email Notifications */}
          <Card shadow="sm" className="w-full">
            <CardBody className="p-4 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1">
                  <Heading className="text-base md:text-lg font-semibold">
                    Enable Email Notifications
                  </Heading>
                  <Text className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Send email notifications for various events
                  </Text>
                </div>
                <div className="flex justify-start sm:justify-end">
                  <SwitchInput
                    name="emailNotifications"
                    color="primary"
                    size="lg"
                  />
                </div>
              </div>
            </CardBody>
          </Card>

          <Divider className="my-2" />

          {/* Notification Types Section */}
          <div>
            <Heading className="text-base md:text-lg font-semibold mb-3">
              Notification Types
            </Heading>

            {/* New Comment Notifications */}
            <Card shadow="sm" className="w-full mb-4">
              <CardBody className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex-1">
                    <Heading className="text-sm md:text-base font-medium">
                      New Comment Notifications
                    </Heading>
                    <Text className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Get notified when someone comments on a post
                    </Text>
                  </div>
                  <div className="flex justify-start sm:justify-end">
                    <SwitchInput
                      name="notifyOnNewComment"
                      color="primary"
                      size="lg"
                      disabled={!emailNotifications}
                    />
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* New Post Notifications */}
            <Card shadow="sm" className="w-full">
              <CardBody className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex-1">
                    <Heading className="text-sm md:text-base font-medium">
                      New Post Notifications
                    </Heading>
                    <Text className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Notify subscribers when a new post is published
                    </Text>
                  </div>
                  <div className="flex justify-start sm:justify-end">
                    <SwitchInput
                      name="notifyOnNewPost"
                      color="primary"
                      size="lg"
                      disabled={!emailNotifications}
                    />
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Contact Email */}
          <Card shadow="sm" className="w-full">
            <CardBody className="p-4 md:p-6">
              <TextInput
                name="contactEmail"
                label="Contact Email"
                type="email"
                placeholder="admin@blog.com"
                required={true}
                validation={{
                  required: "Contact email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                }}
              />
            </CardBody>
          </Card>

          {/* SMTP Configuration */}
          <Card shadow="sm" className="w-full">
            <CardBody className="p-4 md:p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Heading className="text-sm md:text-base font-semibold">
                    SMTP Configuration (Optional)
                  </Heading>
                  <Button
                    size="sm"
                    variant="light"
                    color="primary"
                    onPress={() => setShowSMTPConfig(!showSMTPConfig)}
                  >
                    {showSMTPConfig ? "Hide" : "Configure"}
                  </Button>
                </div>

                {showSMTPConfig && (
                  <div className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <TextInput
                        name="smtpConfig.host"
                        label="SMTP Host"
                        placeholder="smtp.gmail.com"
                      />
                      <NumberInput
                        name="smtpConfig.port"
                        label="SMTP Port"
                        placeholder="587"
                      />
                    </div>

                    <CheckboxInput
                      name="smtpConfig.secure"
                      label="Use SSL/TLS"
                    />

                    <TextInput
                      name="smtpConfig.username"
                      label="Username"
                      placeholder="your-email@gmail.com"
                    />

                    <TextInput
                      name="smtpConfig.password"
                      label="Password"
                      type="password"
                      placeholder="Your SMTP password"
                    />
                  </div>
                )}
              </div>
            </CardBody>
          </Card>

          <Divider className="my-4" />

          {/* Save Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <Button
              type="submit"
              color="primary"
              size="lg"
              isDisabled={!isDirty || saveStatus === "saving"}
              isLoading={saveStatus === "saving"}
              className="w-full sm:w-auto"
            >
              {saveStatus === "saving" ? "Saving..." : "Save Changes"}
            </Button>

            {saveStatus === "success" && (
              <Text className="text-sm text-green-600">
                Settings saved successfully!
              </Text>
            )}
            {saveStatus === "error" && (
              <Text className="text-sm text-red-600">
                Failed to save settings
              </Text>
            )}
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
