import { Text } from "@/components/ui/Text";
import { Card, CardBody } from "@heroui/react";
import React from "react";

export default function TipsCard() {
  return (
    <>
      {/* Publishing Info */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardBody>
          <Text className="text-sm text-blue-700 dark:text-blue-400">
            <strong>Tip:</strong> Make sure all fields are filled out before
            saving. The slug will be auto-generated from the title if changed.
          </Text>
        </CardBody>
      </Card>
    </>
  );
}
