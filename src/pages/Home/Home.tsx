import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { FunctionComponent, useContext, useMemo } from "react";
import {
  Keyboard,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { IconPlus, IconTrophy } from "tabler-icons-react-native";
import { RootStackParamList, SettingsContext } from "../../../App";
import { Exercise } from "../../database/models/Exercise";
import { TrainingLog } from "../../database/models/TrainingLog";
import { useFitnotesDB } from "../../database/useFitnotesDB";
import { kgToLb } from "../../helpers";
import { DateSelect } from "./DateSelect";

export const Home: FunctionComponent<
  NativeStackScreenProps<RootStackParamList, "Home">
> = ({ navigation }) => {
  const { currLogs, selectedDate, setDate } = useFitnotesDB();

  const DEFAULT_METRIC = useContext(SettingsContext).settings.defaultMetric;

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
                  {logs
                    .sort((a, b) => a._id - b._id)
                    .map((log, _idx) => {
                      const kg = log.exercise.default_unit
                        ? DEFAULT_METRIC
                        : log.exercise.unit_metric;

                      return (
                        <View key={_idx} className="flex flex-row mt-1">
                          {log.is_personal_record && (
                            <View className="absolute translate-y-[4px] left-5">
                              <IconTrophy fill="gold" size={18} />
                            </View>
                          )}
                          <View className="flex-grow flex flex-row justify-center items-center">
                            <Text className="text-center text-lg font-bold">
                              {
                                +parseFloat(
                                  (kg
                                    ? log.metric_weight
                                    : kgToLb(log.metric_weight)
                                  ).toFixed(2)
                                )
                              }
                            </Text>
                            <Text className="text-sm">
                              {kg ? " Kg" : " Lb"}
                            </Text>
                          </View>
                          <View className="flex-grow flex flex-row justify-center items-center">
                            <Text className="text-center text-lg font-bold">
                              {log.reps}
                            </Text>
                            <Text className="text-sm"> reps</Text>
                          </View>
                        </View>
                      );
                    })}
                </TouchableOpacity>
              )
            )}
        </ScrollView>
        <TouchableOpacity
          className="w-[70%] mb-4 p-4 flex flex-row bg-green-400 items-center space-x-2 rounded-lg justify-center "
          onPress={() => {
            navigation.navigate("Select Exercise", {});
          }}
        >
          <Text className="text-lg">Track Exercise</Text>
          <IconPlus />
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
};
