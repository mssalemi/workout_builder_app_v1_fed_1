import React from "react";
import { Banner, Text, Link } from "@shopify/polaris";
import { WorkoutProgramDisplay } from "./components/WorkoutProgramDisplay";

import type { WorkoutProgramType } from "../UserWorkoutProgramManager/UserWorkoutProgramManager";

interface Props {
  workoutProgram: WorkoutProgramType;
}

export function WorkoutProgramCardDisplay({ workoutProgram }: Props) {
  return (
    <>
      {" "}
      <Text variant="headingXl" as="h2">
        Example Program 1
      </Text>
      <Text variant="headingXs" as="p">
        Mehdi Salemi
      </Text>
      <WorkoutProgramDisplay workoutProgram={workoutProgram} />
      <Banner>
        <Link url="/v2/66">Edit workout program</Link>
      </Banner>
    </>
  );
}
