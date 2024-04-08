import React, { useState, useEffect } from "react";

import {
  Text,
  Box,
  Card,
  BlockStack,
  InlineGrid,
  ResourceList,
  ResourceItem,
  Avatar,
  Button,
} from "@shopify/polaris";
import { HomeIcon } from "@shopify/polaris-icons";

import { WorkoutProgramCardDisplay } from "../WorkoutProgramCardDisplay/WorkoutProgramCardDisplay";

function UserWorkoutProgramManager() {
  // selected = value
  const items = [
    {
      id: "program-1",
      title: "Example Program 1",
      author: "Mehdi Salemi",
    },
  ];

  const [selected, setSelected] = useState<string | undefined>(undefined);

  useEffect(() => {
    console.log("Selected:", selected);
  }, [selected]);

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
        <BlockStack gap="200">
          <InlineGrid columns="1fr auto">
            <Text as="h2" variant="headingSm">
              Workout Programs
            </Text>
            <Button
              onClick={() => {
                setSelected(undefined);
              }}
              accessibilityLabel="Export variants"
              icon={HomeIcon}
              disabled={!selected}
            />
          </InlineGrid>
          <Box>
            <Text as="p" variant="bodyMd">
              View a list of all your available workout programs!
            </Text>
          </Box>
          {!selected && (
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
                    onClick={(value) => {
                      console.log("I got Clicked", value);
                      setSelected(value);
                    }}
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
          )}
          {selected && <WorkoutProgramCardDisplay />}
        </BlockStack>
      </Card>
    </div>
  );
}

export default UserWorkoutProgramManager;
