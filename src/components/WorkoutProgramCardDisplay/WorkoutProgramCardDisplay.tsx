import React from "react";
import { Banner, Text, Link } from "@shopify/polaris";
import { WorkoutProgramDisplay } from "./components/WorkoutProgramDisplay";

interface Props {}

export function WorkoutProgramCardDisplay() {
  return (
    <>
      {" "}
      <Text variant="headingXl" as="h2">
        Example Program 1
      </Text>
      <Text variant="headingXs" as="p">
        Mehdi Salemi
      </Text>
      <WorkoutProgramDisplay />
      <Banner>
        <Link url="/v2/66">Edit workout program</Link>
      </Banner>
    </>
  );
}
