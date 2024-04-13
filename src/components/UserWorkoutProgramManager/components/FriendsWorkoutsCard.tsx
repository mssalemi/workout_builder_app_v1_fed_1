import React, { useState, useEffect } from "react";
import type { WorkoutProgramType } from "../UserWorkoutProgramManager";

import { Box, Grid, Card, Text } from "@shopify/polaris";
import {
  Box as MuiBox,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
} from "@mui/material";

import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import { useQuery, gql } from "@apollo/client";

const FIND_FRIENDS_DATA = gql`
  query FindWorkoutProgramsByUser {
    findFriendsWorkoutPrograms {
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
    userFriends {
      id
      name
      email
    }
  }
`;

interface FriendsTableRowData {
  name: string;
  createdAt: string;
  title: string;
  workoutProgram: {
    id: string;
    weeks: number;
    difficultyLevel: string;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
}

export function FriendsWorkoutsCard() {
  const { loading, error, data, refetch } = useQuery(FIND_FRIENDS_DATA, {
    variables: {},
  });

  const users: User[] = data?.userFriends;
  const workoutPrograms = data?.findFriendsWorkoutPrograms;

  useEffect(() => {
    // console.log("data", data);
    // console.log("error", error);
    // console.log("loading", loading);
    const users = data?.userFriends;
    const workoutPrograms = data?.findFriendsWorkoutPrograms;
    // console.log("users", users);
    // console.log("workoutPrograms", workoutPrograms);
  }, [data, error, loading]);

  const friendsTableData: FriendsTableRowData[] = workoutPrograms?.map(
    ({ userId, title, weeks, difficultyLevel }: WorkoutProgramType) => {
      return {
        name:
          users?.find(
            (user: { id: string; name: string; email: string }) =>
              user.id === userId
          )?.name || "",
        createdAt: new Date().toISOString(),
        title,
        workoutProgram: {
          id: userId,
          weeks: weeks.length,
          difficultyLevel,
        },
      };
    }
  );

  // console.log("friendsTableData", friendsTableData);

  return (
    <Box paddingBlock="200">
      <Card roundedAbove="sm">
        <Text as="h2" variant="headingSm">
          Friends Dashboard
        </Text>
        <Box paddingBlock="200">
          <Text as="p" variant="bodyMd">
            View a summary of your friends workouts!
          </Text>
        </Box>

        <FriendsList users={users} />

        <Text as="h3" variant="headingSm">
          Friends Workout Programs
        </Text>
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>User</TableCell>
                <TableCell align="right">Workout Program</TableCell>
                <TableCell align="right">Created At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {friendsTableData?.map((row) => (
                <FriendsTableRow key={row.name} row={row} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}

const FriendsTableRow = ({ row }: { row: FriendsTableRowData }) => {
  const [open, setOpen] = useState(false);
  // console.log(row);
  const { name, createdAt, title, workoutProgram } = row;

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell align="right">{row.title}</TableCell>
        <TableCell align="right">{row.createdAt}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <MuiBox sx={{ margin: 1 }}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Weeks</TableCell>
                    <TableCell>Difficulty Level</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row && (
                    <TableRow key={createdAt}>
                      <TableCell component="th" scope="row">
                        {row.workoutProgram.weeks}
                      </TableCell>
                      <TableCell>
                        {row.workoutProgram.difficultyLevel}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </MuiBox>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const FriendsList = ({ users }: { users: User[] | undefined }) => {
  if (!users) {
    return <>"You are a loser - No friends found!"</>;
  }

  return (
    <>
      <Text as="h3" variant="headingSm">
        Friends
      </Text>
      <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
        {users?.map((user: User) => {
          const { id, name, email } = user;
          return (
            <>
              <ListItem key={id}>
                <ListItemAvatar>
                  <Avatar>
                    <BeachAccessIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={name} secondary={email} />
              </ListItem>
            </>
          );
        })}
      </List>
    </>
  );
};
