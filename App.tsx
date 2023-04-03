import { createContext, FunctionComponent, useEffect, useState } from "react";
import { TouchableOpacity, Button } from "react-native";
import { FitnotesDBProvider } from "./src/database/useFitnotesDB";
import { Home } from "./src/pages/Home/Home";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import "reflect-metadata";
import { IconSettings } from "tabler-icons-react-native";
import { SelectExercise } from "./src/pages/Exercises/SelectExercise";
import { DistanceUnit, Exercise, WeightUnit, TimeUnit } from "./src/database/models/Exercise";
import { ExerciseLogNavigation } from "./src/pages/ExerciseLog/ExerciseLog";
import { ManageCategories } from "./src/pages/Categories/ManageCategories";
import { ManageExercises } from "./src/pages/Exercises/ManageExercises";
import { EditExercise } from "./src/pages/Exercises/EditExercise";
import { Settings } from "./src/pages/Settings/Settings";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AddExercise } from "./src/pages/Exercises/AddExercise";
import { ImportData } from "./src/pages/Settings/ImportData";

export type RootStackParamList = {
  Home: {};
  "Select Exercise": {};
  "Exercise Log": {
    exercise: Exercise;
  };
  "Manage Exercises": {};
  "Add Exercise": {};
  "Edit Exercise": {
    exercise: Exercise;
  };
  "Manage Categories": {};
  "Import Data": {};
  Settings: {};
};

interface ISettings {
  weightUnit: WeightUnit;
  distanceUnit: DistanceUnit;
  timeUnit: 
  defaultIncrement: number;
}

interface ISettingsContext {
  settings: ISettings;
  updateSettings: (settings: Partial<ISettings>) => void;
}

const DEFAULT_SETTINGS: ISettings = {
  weightUnit: WeightUnit.DEFAULT,
  distanceUnit: DistanceUnit.DEFAULT,
  timeUnit: TimeUnit.DEFAULT,
};

export const SettingsContext = createContext<ISettingsContext>({
  settings: DEFAULT_SETTINGS,
  updateSettings: () => {},
});

const Stack = createNativeStackNavigator<RootStackParamList>();

export const App: FunctionComponent = () => {
  const [settings, setSettings] = useState<ISettings>(DEFAULT_SETTINGS);

  const updateSettings = (newSettings: Partial<ISettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    AsyncStorage.setItem("settings", JSON.stringify(updatedSettings));
  };

  useEffect(() => {
    AsyncStorage.getItem("settings").then((storedSettings) => {
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }
    });
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
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
                headerLeft: () => (
                  <TouchableOpacity
                    className="flex flex-row items-center px-1"
                    onPress={() => navigation.navigate("Settings")}
                  >
                    <IconSettings size={22} strokeWidth={2} color="#007AFF" />
                  </TouchableOpacity>
                ),
              })}
            />
            <Stack.Screen name="Exercise Log" component={ExerciseLogNavigation} />
            <Stack.Screen name="Settings" component={Settings} />
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
            <Stack.Screen
              name="Import Data"
              component={ImportData}
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
                  headerRight: () => (
                    <Button
                      title="Add"
                      onPress={() => {
                        navigation.navigate("Add Exercise");
                      }}
                    />
                  ),
                })}
              />
              <Stack.Screen name="Edit Exercise" component={EditExercise} />
              <Stack.Screen name="Add Exercise" component={AddExercise} />
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
    </SettingsContext.Provider>
  );
};

export default App;
