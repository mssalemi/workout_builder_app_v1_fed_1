import React, { useState } from "react";

import {
  Typography,
  Box,
  Button,
  TextField,
  Grid,
  MenuItem,
} from "@mui/material";

import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";

import { gql, useMutation } from "@apollo/client";

// FIX ME

const CREATE_WORKOUT_PROGRAM_MUTATION = gql`
  mutation CreateWorkoutProgram($input: CreateWorkoutProgramInput!) {
    createWorkoutProgram(input: $input) {
      workoutProgram {
        id
        title
        description
        difficultyLevel
        durationWeeks
        user {
          id
        }
      }
      success
      errors
    }
  }
`;

export function CreateWorkoutProgramForm() {
  const [createWorkoutProgram, { loading }] = useMutation(
    CREATE_WORKOUT_PROGRAM_MUTATION
  );

  const [title, setTitle] = useState("Workout Program");
  const [description, setDescription] = useState("This is a workout program");
  const [difficultyLevel, setDifficultyLevel] = useState("Easy");
  const [durationWeeks, setDurationWeeks] = useState(3);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log("I GOT CALLED");
    const variables = {
      input: {
        title: title,
        description: description,
        difficultyLevel: difficultyLevel,
        durationWeeks: durationWeeks,
      },
    };
    console.log("Variables", variables);
    const { data } = await createWorkoutProgram({
      variables: variables,
    });
    console.log("Data", data);
  };

  return (
    <form onSubmit={handleSubmit} noValidate autoComplete="off">
      <Grid container direction="column" spacing={3}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <FitnessCenterIcon sx={{ mr: 1, color: "primary.main" }} />
          <Typography variant="h5" sx={{ color: "#4169E1" }}>
            Create Workout Program
          </Typography>
        </Box>

        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          select // This enables the select option
          label="Difficulty Level"
          variant="outlined"
          fullWidth
          value={difficultyLevel}
          onChange={(e) => setDifficultyLevel(e.target.value)}
          helperText="Select difficulty level"
          sx={{ mb: 2 }}
        >
          {/* MenuItems for each difficulty level option */}
          <MenuItem value="Easy">Easy</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="Hard">Hard</MenuItem>
          <MenuItem value="Elite">Elite</MenuItem>
          <MenuItem value="World Class">World Class</MenuItem>
        </TextField>

        <TextField
          label="Duration (Weeks)"
          variant="outlined"
          fullWidth
          type="number"
          value={durationWeeks}
          onChange={(e) => setDurationWeeks(parseInt(e.target.value))}
          sx={{ mb: 2 }}
        />

        <Grid container justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? "Submitting..." : "Create Workout Program"}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
