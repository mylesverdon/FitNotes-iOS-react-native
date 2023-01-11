import { FunctionComponent } from "react";
import { Keyboard, TouchableOpacity, Text, View, Button } from "react-native";
import { FitnotesDBProvider } from "./src/database/useFitnotesDB";
import { Home } from "./src/pages/Home/Home";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import "reflect-metadata";
import { IconPlus } from "tabler-icons-react-native";
import { SelectExercise } from "./src/pages/AddExercise/SelectExercise";
import { Provider as PaperProvider } from "react-native-paper";
import { Exercise } from "./src/database/models/Exercise";
import { ExerciseLogNavigation } from "./src/pages/ExerciseLog/ExerciseLog";
import { ManageCategories } from "./src/pages/AddExercise/ManageCategories";
import { ManageExercises } from "./src/pages/AddExercise/ManageExercises";

export type RootStackParamList = {
  Home: {};
  "Select Exercise": {};
  "Exercise Log": {
    exercise: Exercise;
  };
  "Manage Exercises": {};
  "Manage Categories": {};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const App: FunctionComponent = () => {
  return (
    <PaperProvider>
      <NavigationContainer>
        <FitnotesDBProvider>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{ animation: "slide_from_right" }}
          >
            <Stack.Screen
              name="Home"
              component={Home}
              options={({ navigation }) => ({
                headerBackButtonMenuEnabled: true,
              })}
            />
            <Stack.Screen
              name="Exercise Log"
              component={ExerciseLogNavigation}
            />
            <Stack.Screen
              name="Select Exercise"
              component={SelectExercise}
              options={({ navigation }) => ({
                headerRight: () => (
                  <Button
                    title="Edit"
                    onPress={() => {
                      navigation.navigate("Manage Exercises", {});
                    }}
                  />
                ),
              })}
            />
            <Stack.Group screenOptions={{ presentation: "modal" }}>
              <Stack.Screen
                name="Manage Exercises"
                component={ManageExercises}
                options={({ navigation }) => ({
                  headerLeft: () => (
                    <Button
                      title="Cancel"
                      onPress={() => {
                        navigation.goBack();
                      }}
                    />
                  ),
                })}
              />
              <Stack.Screen
                name="Manage Categories"
                component={ManageCategories}
                options={({ navigation }) => ({
                  headerLeft: () => (
                    <Button
                      title="Cancel"
                      onPress={() => {
                        navigation.goBack();
                      }}
                    />
                  ),
                })}
              />
            </Stack.Group>
          </Stack.Navigator>
        </FitnotesDBProvider>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
