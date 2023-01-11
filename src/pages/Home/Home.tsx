import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { FunctionComponent, useMemo } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { IconPlus } from "tabler-icons-react-native";
import { RootStackParamList } from "../../../App";
import { Exercise } from "../../database/models/Exercise";
import { TrainingLog } from "../../database/models/TrainingLog";
import { useFitnotesDB } from "../../database/useFitnotesDB";
import { DateSelect } from "./DateSelect";

export const Home: FunctionComponent<
  NativeStackScreenProps<RootStackParamList, "Home">
> = ({ navigation }) => {
  const { currLogs, selectedDate, setDate } = useFitnotesDB();

  const exerciseGroups: Map<Exercise, TrainingLog[]> = useMemo(() => {
    const _exerciseGroups = new Map<Exercise, TrainingLog[]>();
    const idExerciseMap = new Map<number, Exercise>();

    currLogs.forEach((log) => {
      const exercise = log.exercise;
      if (!idExerciseMap.has(exercise._id)) {
        idExerciseMap.set(exercise._id, exercise);
        _exerciseGroups.set(exercise, [log]);
      } else {
        _exerciseGroups.get(idExerciseMap.get(exercise._id)!)!.push(log);
      }
    });

    return _exerciseGroups;
  }, [currLogs]);

  return (
    <>
      <SafeAreaView className="h-full flex items-center bg-slate-100">
        <DateSelect date={selectedDate} onDateChange={setDate} />
        {/* <Button title="Clear Database" onPress={clearDB} /> */}
        <ScrollView
          className="flex-grow flex space-y-4 mt-4 w-full px-8"
          scrollsToTop={true}
        >
          {exerciseGroups.size > 0 &&
            Array.from(exerciseGroups.entries()).map(
              ([exercise, logs], idx) => (
                <TouchableOpacity
                  className="bg-white shadow-sm rounded-lg pb-2"
                  key={idx}
                  onPress={() => {
                    navigation.navigate("Exercise Log", { exercise });
                  }}
                >
                  <View className="border-b-2 py-1 border-slate-200">
                    <Text className="text-center text-lg font-bold border-slate-200">
                      {exercise.name}
                    </Text>
                  </View>
                  {logs.map((log, _idx) => (
                    <View key={_idx} className="flex flex-row mt-1">
                      <View className="flex-grow flex flex-row justify-center items-center">
                        <Text className="text-center text-lg font-bold">
                          {log.metric_weight.toFixed(1)}
                        </Text>
                        <Text className="text-sm"> kgs</Text>
                      </View>
                      <View className="flex-grow flex flex-row justify-center items-center">
                        <Text className="text-center text-lg font-bold">
                          {log.reps}
                        </Text>
                        <Text className="text-sm"> reps</Text>
                      </View>
                    </View>
                  ))}
                </TouchableOpacity>
              )
            )}
        </ScrollView>
        <TouchableOpacity
          className="mb-4 p-4 flex flex-row bg-green-400 items-center space-x-2 rounded-lg"
          onPress={() => {
            navigation.navigate("Select Exercise", {});
          }}
        >
          <Text className="text-lg">Add Workout</Text>
          <IconPlus />
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
};
