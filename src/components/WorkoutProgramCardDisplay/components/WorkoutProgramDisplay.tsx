import React, { useState, useCallback } from "react";

import { Tabs } from "@shopify/polaris";

import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableFooter from "@mui/material/TableFooter";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Unstable_Grid2";
import type { WorkoutProgramType } from "../../UserWorkoutProgramManager/UserWorkoutProgramManager";

export function WorkoutProgramDisplay({
  workoutProgram,
}: {
  workoutProgram: WorkoutProgramType;
}) {
  console.log("WORKOUT PROGRAM", workoutProgram);

  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex: number) => setSelected(selectedTabIndex),
    []
  );

  const tabsByWeek: {
    id: string;
    content: string;
    panelID: string;
    week: Week | undefined;
  }[] = workoutProgram.weeks.map((week, index) => {
    console.log("week", week);
    return {
      id: `week-${index}`,
      content: `Week ${index + 1}`,
      panelID: `week-${index}-content`,
      week: week,
    };
  });

  return (
    <>
      <Tabs tabs={tabsByWeek} selected={selected} onSelect={handleTabChange}>
        <WeeklyWorkoutDisplay week={tabsByWeek[selected]?.week} />
      </Tabs>
    </>
  );
}

function createWorkoutTableData(
  exercise: Exercise,
  title: string
): {
  name: string;
  sets: number;
  reps: number;
  weight: number;
  rest: number;
  title: string;
} {
  return {
    name: exercise.exercise.title,
    sets: exercise.performanceData.sets,
    reps: exercise.performanceData.reps,
    weight: exercise.performanceData.weight,
    title: title,
    rest: 60,
  };
}

const WeeklyWorkoutDisplay = ({ week }: { week: Week | undefined }) => {
  console.log(week);
  console.log(week?.workouts);

  // this is an array of tables
  const dailyWorkoutsMarkup = week?.workouts.map((workout) => {
    const tableData = workout.exercises.map((exercise) =>
      createWorkoutTableData(exercise, workout.title)
    );
    console.log("table data", tableData);
    return (
      <Grid xs={6}>
        <Typography variant="h6" gutterBottom>
          {workout.title}
        </Typography>
        <TableContainer component={Paper}>
          <Table size="small" aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Exercise</TableCell>
                <TableCell align="right">Sets</TableCell>
                <TableCell align="right">Reps</TableCell>
                <TableCell align="right">Weight</TableCell>
                <TableCell align="right">Rest</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.sets}</TableCell>
                  <TableCell align="right">{row.reps}</TableCell>
                  <TableCell align="right">{row.weight}</TableCell>
                  <TableCell align="right">{row.rest}</TableCell>
                </TableRow>
              ))}
              {tableData.length === 0 && (
                <TableRow>
                  <></>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <EditWorkoutComponent workout={workout} />
            </TableFooter>
          </Table>
        </TableContainer>
      </Grid>
    );
  });

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        {dailyWorkoutsMarkup}
      </Grid>
    </Box>
  );
};

interface EditWorkoutComponentProps {
  workout: Workout;
}

const EditWorkoutComponent = ({ workout }: EditWorkoutComponentProps) => {
  return (
    <>
      <Link href={`/v2/${workout.id}`} variant="body2">
        {"Edit Workout"}
      </Link>
    </>
  );
};

interface Workout {
  exercises: Exercise[];
  title: string;
  id: number;
}

interface Week {
  workouts: Workout[];
  order: number;
  workoutProgramId: string;
}

interface Exercise {
  performanceData: {
    reps: number;
    weight: number;
    sets: number;
  };
  exercise: {
    title: string;
  };
}
