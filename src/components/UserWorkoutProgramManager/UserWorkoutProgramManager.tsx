import React, { useState, useEffect, useMemo } from "react";

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

import { useQuery, gql } from "@apollo/client";

import { WorkoutProgramCardDisplay } from "../WorkoutProgramCardDisplay/WorkoutProgramCardDisplay";

const FIND_USER_WORKOUT_PROGRAMS = gql`
  query FindWorkoutProgramsByUser {
    findWorkoutProgramsByUser {
      id
      userId
      title
      description
      difficultyLevel
      weeks {
        workoutProgramId
        order
        workouts {
          id
          title
          exercises {
            performanceData {
              reps
              weight
              sets
            }
            exercise {
              title
            }
            userId
          }
        }
      }
    }
  }
`;

export interface WorkoutProgramType {
  id: string;
  title: string;
  userId: string;
  description: string;
  difficultyLevel: string;
  weeks: any[];
}

function UserWorkoutProgramManager() {
  const { loading, error, data, refetch } = useQuery(
    FIND_USER_WORKOUT_PROGRAMS,
    {
      variables: {},
    }
  );

  const workoutPrograms = useMemo(
    () =>
      data?.findWorkoutProgramsByUser?.map(
        ({
          id,
          title,
          userId,
          description,
          difficultyLevel,
          weeks,
        }: WorkoutProgramType) => {
          return {
            id,
            title,
            userId,
            description,
            difficultyLevel,
            weeks,
          };
        }
      ),
    [data]
  );

  const [selected, setSelected] = useState<string | undefined>(undefined);

  useEffect(() => {
    // console.log("Selected:", selected);
  }, [selected]);

  const items = workoutPrograms
    ? workoutPrograms.map(
        ({
          id,
          title,
          userId,
          description,
          difficultyLevel,
          weeks,
        }: {
          id: string;
          title: string;
          userId: string;
          description: string;
          difficultyLevel: string;
          weeks: any[];
        }) => {
          return {
            id,
            title,
            author: "MedxMan",
          };
        }
      )
    : [];

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
              loading={loading}
              renderItem={(item) => {
                const { id, author, title } = item;
                const media = <Avatar customer size="md" name={author} />;

                return (
                  <ResourceItem
                    id={id}
                    url={""}
                    onClick={(value) => {
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
          {selected && (
            <WorkoutProgramCardDisplay
              workoutProgram={workoutPrograms.find(
                (program: WorkoutProgramType) => program.id === selected
              )}
            />
          )}
        </BlockStack>
      </Card>
    </div>
  );
}

export default UserWorkoutProgramManager;
