import React, { useState, useEffect, useMemo } from "react";

import {
  Text,
  Box as PolarisBox,
  Card,
  BlockStack,
  InlineGrid,
  ResourceList,
  ResourceItem,
  Avatar,
  Button as PolarisButton,
} from "@shopify/polaris";
import { HomeIcon } from "@shopify/polaris-icons";

import { FriendsWorkoutsCard } from "./components/FriendsWorkoutsCard";

import { useQuery, gql } from "@apollo/client";

import { WorkoutProgramCardDisplay } from "../WorkoutProgramCardDisplay/WorkoutProgramCardDisplay";
import { CreateWorkoutProgramForm } from "../master/CreateWorkoutProgramForm";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

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

  const items = workoutPrograms?.length
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
        <PolarisBox paddingBlock="200">
          <Text as="p" variant="bodyMd">
            View a summary of your recent workouts stats!
          </Text>
        </PolarisBox>
      </Card>

      <Card roundedAbove="sm">
        <BlockStack gap="200">
          <InlineGrid columns="1fr auto">
            <Text as="h2" variant="headingSm">
              Workout Programs
            </Text>
            <PolarisButton
              onClick={() => {
                setSelected(undefined);
              }}
              accessibilityLabel="Export variants"
              icon={HomeIcon}
              disabled={!selected}
            />
          </InlineGrid>
          <PolarisBox>
            <Text as="p" variant="bodyMd">
              View a list of all your available workout programs!
            </Text>
          </PolarisBox>
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
        <AddNewWorkoutProgramForm />
      </Card>

      <FriendsWorkoutsCard />
    </div>
  );
}

const AddNewWorkoutProgramForm = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box paddingBlock="200">
      <PolarisButton onClick={handleOpen}>
        Add New Workout Program
      </PolarisButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <CreateWorkoutProgramForm />
        </Box>
      </Modal>
    </Box>
  );
};

export default UserWorkoutProgramManager;
