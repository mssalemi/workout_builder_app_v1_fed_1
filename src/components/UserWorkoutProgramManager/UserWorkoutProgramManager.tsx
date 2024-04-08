import React from "react";

import { Text, Box, Card } from "@shopify/polaris";

function UserWorkoutProgramManager() {
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
            View a list of all available workout programs!
          </Text>
        </Box>
      </Card>
    </div>
  );
}

export default UserWorkoutProgramManager;
