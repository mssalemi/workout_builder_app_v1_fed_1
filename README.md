# Getting Started with Workout Builder App

## Available Scripts

Backend: `rails s`

Frontend: `npm run start`

## Api Queries

- Get Exercises

```gql
  query GetExercise {
    exercises {
      id
      title
      bodyPartMain
      bodyPartAccessory
    }
  }
```

- Add Exercise to Workout

```gql
  mutation AddExerciseToWorkout($input: AddExerciseToWorkoutInput!) {
    addExerciseToWorkout(input: $input) {
      title
    }
  }
```

- Find Workouts

```gql
  query FindWorkout($workoutId: ID!) {
    findWorkout(workoutId: $workoutId) {
      title
      id
      userId
      exercises {
        completed
        order
        performanceData {
          reps
          weight
          sets
        }
        exercise {
          id
          title
          description
          bodyPartMain
        }
        exerciseHistoryId
      }
    }
  }
```

- Find all Workouts by User

```gql
query FindWorkoutsByUser($userId: ID!) {
    findWorkoutsByUser(userId: $userId) {
      title
      id
      userId
      exercises {
        completed
        order
        performanceData {
          reps
          weight
          sets
        }
        exercise {
          id
          title
          description
          bodyPartMain
        }
        exerciseHistoryId
      }
    }
  }
```
