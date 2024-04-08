import React, { useState } from "react";

import {
  Text,
  Box,
  Card,
  OptionList,
  LegacyStack,
  ResourceList,
  ResourceItem,
  Avatar,
} from "@shopify/polaris";
import type { ResourceListProps } from "@shopify/polaris";
import { PlusCircleIcon } from "@shopify/polaris-icons";

function UserWorkoutProgramManager() {
  const [selected, setSelected] = useState<string[]>([]);

  const workoutProgramListHeader = "Workout Programs";

  const workoutPrograms = [
    { value: "program-1", label: "Example Program 1" },
    { value: "program-2", label: "Example Program 2" },
  ];
  // selected = value
  const items = [
    {
      id: "program-1",
      title: "Example Program 1",
      author: "Mehdi Salemi",
    },
  ];

  const [selectedItems, setSelectedItems] = useState<
    ResourceListProps["selectedItems"]
  >([]);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr",
        gridGap: "1rem",
      }}
    >
      <Card roundedAbove="sm">
        <Text as="h2" variant="headingSm">
          Dashboard
        </Text>
        <Box paddingBlock="200">
          <Text as="p" variant="bodyMd">
            View a summary of your recent workouts stats!
          </Text>
        </Box>
      </Card>

      <Card roundedAbove="sm">
        <Text as="h2" variant="headingSm">
          View Programs
        </Text>
        <Box paddingBlock="200">
          <Text as="p" variant="bodyMd">
            View a list of all your available workout programs!
          </Text>
        </Box>
        <ResourceList
          resourceName={{ singular: "customer", plural: "customers" }}
          items={items}
          renderItem={(item) => {
            const { id, author, title } = item;
            const media = <Avatar customer size="md" name={author} />;

            return (
              <ResourceItem
                id={id}
                url={""}
                media={media}
                accessibilityLabel={`View details for ${author}`}
              >
                <Text variant="bodyMd" fontWeight="bold" as="h3">
                  {title}
                </Text>
                <div>{author}</div>
              </ResourceItem>
            );
          }}
        />
      </Card>
    </div>
  );
}

export default UserWorkoutProgramManager;
