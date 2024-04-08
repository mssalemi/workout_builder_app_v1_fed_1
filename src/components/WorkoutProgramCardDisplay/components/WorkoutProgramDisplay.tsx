import React from "react";

import { DescriptionList, Grid, Text } from "@shopify/polaris";

export function WorkoutProgramDisplay() {
  return (
    <>
      <WeekDisplay />
    </>
  );
}

const WeekDisplay = () => {
  const items = [
    {
      term: "Workout A",
      description: <WorkoutDescription />,
    },
    {
      term: "Workout B",
      description: <WorkoutDescription />,
    },
    {
      term: "Workout C",
      description: <WorkoutDescription />,
    },
  ];
  return (
    <>
      <Text variant="headingSm" as="h6">
        Week 1
      </Text>
      <DescriptionList items={items} />
    </>
  );
};

const WorkoutDescription = () => {
  return (
    <Grid>
      <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 4, xl: 4 }}>
        <div
          style={{
            height: "100%",
            border: "1px solid #dfe3e8",
            padding: "0.5rem",
          }}
        >
          <p>3x5 Bench Press</p>
          <p>3x10 Lat Pulldown</p>
        </div>
      </Grid.Cell>
      <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 4, xl: 4 }}>
        <div
          style={{
            height: "100%",
            border: "1px solid #dfe3e8",
            padding: "0.5rem",
          }}
        >
          <p>3x8 Leg Press</p>
          <p>3x12 Hamstring Curl</p>
          <p>3x8 Lunges</p>
        </div>
      </Grid.Cell>
      <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 4, xl: 4 }}>
        <div
          style={{
            height: "100%",
            border: "1px solid #dfe3e8",
            padding: "0.5rem",
          }}
        >
          <p>3x5 Bench Press</p>
          <p>3x10 Lat Pulldown</p>
        </div>
      </Grid.Cell>
    </Grid>
  );
};
