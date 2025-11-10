"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { Button, Card, CardBody, Divider, Input, Chip } from "@heroui/react";
import {
  MaintenanceSettingsValue,
  DEFAULT_MAINTENANCE_SETTINGS,
  SETTING_KEYS,
  SETTING_CATEGORIES,
} from "../interfaces/settings";
import { SettingsService } from "@/services/settingsService";
import { SkeletonCard } from "@/components/ui/Skeletons/SkeletonCard";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { TextareaInput, SwitchInput } from "@/components/ui/Inputs";
import { Plus, X, AlertTriangle } from "lucide-react";

export default function MaintenanceSettings() {
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");

  const methods = useForm<MaintenanceSettingsValue>({
    defaultValues: DEFAULT_MAINTENANCE_SETTINGS,
  });

  const {
    handleSubmit,
    reset,
    control,
    watch,
    register,
    formState: { errors, isDirty },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "allowedIPs" as never,
  });

  const maintenanceMode = watch("maintenanceMode");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const setting = await SettingsService.getSettingByKey(
        SETTING_KEYS.MAINTENANCE
      );
      if (setting) {
        reset(setting.value as MaintenanceSettingsValue);
      }
    } catch (error) {
      console.error("Failed to load maintenance settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: MaintenanceSettingsValue) => {
    setSaveStatus("saving");
    try {
      await SettingsService.upsertSetting({
        key: SETTING_KEYS.MAINTENANCE,
        value: data as unknown as JSON,
        category: SETTING_CATEGORIES.SYSTEM,
        description: "Maintenance mode configuration",
      });
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (error) {
      console.error("Failed to save maintenance settings:", error);
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
            Maintenance Mode
          </Heading>
          <Text className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
            Control site availability and maintenance messaging
          </Text>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 md:space-y-6"
        >
          {/* Maintenance Mode Toggle */}
          <Card shadow="sm" className="w-full">
            <CardBody className="p-4 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1">
                  <Heading className="text-base md:text-lg font-semibold">
                    Enable Maintenance Mode
                  </Heading>
                  <Text className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">
                    When enabled, only allowed IPs can access the site
                  </Text>
                </div>
                <div className="flex justify-start sm:justify-end">
                  <SwitchInput
                    name="maintenanceMode"
                    color="warning"
                    size="lg"
                  />
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Warning Box */}
          {maintenanceMode && (
            <Card
              shadow="sm"
              className="w-full bg-warning-50 dark:bg-warning-900/20"
            >
              <CardBody className="p-4 md:p-6">
                <div className="flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-warning-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <Heading className="text-sm font-medium text-warning-800 dark:text-warning-200">
                      Warning: Maintenance Mode is Active
                    </Heading>
                    <Text className="text-xs md:text-sm mt-1 text-warning-700 dark:text-warning-300">
                      Only allowed IP addresses will be able to access the site.
                    </Text>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Maintenance Message */}
          <Card shadow="sm" className="w-full">
            <CardBody className="p-4 md:p-6">
              <TextareaInput
                name="maintenanceMessage"
                label="Maintenance Message"
                placeholder="We're upgrading our systems. Please check back soon!"
                rows={4}
                required={true}
                disabled={!maintenanceMode}
              />
            </CardBody>
          </Card>

          {/* Allowed IPs */}
          <Card shadow="sm" className="w-full">
            <CardBody className="p-4 md:p-6">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <Heading className="text-sm md:text-base font-medium">
                      Allowed IP Addresses
                    </Heading>
                    <Text className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                      IP addresses that can access the site during maintenance
                    </Text>
                  </div>
                  <Button
                    size="sm"
                    color="primary"
                    variant="flat"
                    startContent={<Plus className="w-4 h-4" />}
                    onPress={() => append("")}
                    isDisabled={!maintenanceMode}
                    className="w-full sm:w-auto"
                  >
                    Add IP
                  </Button>
                </div>

                <div className="space-y-2">
                  {fields.length === 0 && (
                    <Text className="text-sm text-gray-500 italic">
                      No allowed IPs configured
                    </Text>
                  )}
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                      <Input
                        {...register(`allowedIPs.${index}` as const, {
                          pattern: {
                            value: /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/,
                            message: "Invalid IP address format",
                          },
                        })}
                        placeholder="192.168.1.1"
                        isDisabled={!maintenanceMode}
                        isInvalid={!!errors.allowedIPs?.[index]}
                        errorMessage={
                          errors.allowedIPs?.[index]?.message as string
                        }
                        classNames={{
                          base: "flex-1",
                        }}
                      />
                      <Button
                        isIconOnly
                        size="lg"
                        color="danger"
                        variant="flat"
                        onPress={() => remove(index)}
                        isDisabled={!maintenanceMode}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
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
