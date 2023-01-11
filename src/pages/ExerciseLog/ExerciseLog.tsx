import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { FunctionComponent, useEffect, useMemo, useState } from "react";
import { RootStackParamList } from "../../../App";
import {
  FlatList,
  Pressable,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Keyboard,
} from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Exercise } from "../../database/models/Exercise";
import { NumericInput } from "../../common/NumericInput";
import { TrainingLog } from "../../database/models/TrainingLog";
import { useFitnotesDB } from "../../database/useFitnotesDB";
import { IconTrophy } from "tabler-icons-react-native";

const Tab = createMaterialTopTabNavigator();

const TrackExercise: FunctionComponent<{ exercise: Exercise }> = ({
  exercise,
}) => {
  const [weight, setWeight] = useState<number>(20);
  const [reps, setReps] = useState<number>(10);

  const [toUpdate, setToUpdate] = useState<TrainingLog>();

  const { log, currLogs, deleteLog, updateLog } = useFitnotesDB();

  const exerciseLogs = useMemo(
    () => currLogs.filter((log) => log.exercise._id === exercise._id),
    [currLogs, exercise]
  );

  useEffect(() => {
    if (toUpdate) {
      setReps(toUpdate.reps);
      setWeight(toUpdate.metric_weight);
    }
  }, [toUpdate]);

  const _delete = () => {
    if (!toUpdate) return;
    deleteLog(toUpdate);
    setToUpdate(undefined);
  };

  const update = () => {
    if (!toUpdate) return;
    updateLog(toUpdate, weight, reps);
    setToUpdate(undefined);
  };

  return (
    <Pressable
      onPress={() => {
        Keyboard.dismiss();
      }}
      className="w-full h-full flex items-center px-8 bg-white"
    >
      {/* Weight */}
      <View className="mt-4">
        <Text className="text-lg font-bold text-center">Weight</Text>
        <NumericInput onChange={setWeight} value={weight} step={1.5} />
      </View>
      {/* Reps */}
      <View className="mt-4">
        <Text className="text-lg font-bold text-center">Reps</Text>
        <NumericInput onChange={setReps} value={reps} integer />
      </View>
      {toUpdate ? (
        <View className="mt-8 flex flex-row space-x-2 w-[80%] items-center">
          <TouchableOpacity
            className="flex-1 rounded-md bg-blue-400 h-14 flex justify-center"
            onPress={update}
          >
            <View>
              <Text className="text-center text-xl">Update</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 rounded-md bg-red-400 h-14 flex justify-center"
            onPress={_delete}
          >
            <View>
              <Text className="text-center text-xl">Delete</Text>
            </View>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          className={`mt-8 w-[80%] h-14 rounded-md flex items-center justify-center bg-green-300`}
          onPress={() => {
            Keyboard.dismiss();
            log(exercise, weight, reps);
          }}
        >
          <Text className="text-xl">Save</Text>
        </TouchableOpacity>
      )}
      {/* List */}
      <FlatList
        className="mt-4 flex space-y-2 w-full pb-1"
        data={exerciseLogs}
        renderItem={({ item, index }) => (
          <Pressable
            className={`rounded-sm flex flex-row w-full border-b-2 border-slate-200 h-10 items-center ${
              toUpdate?._id === item._id ? "bg-blue-200 shadow-md" : ""
            }`}
            onPress={() => {
              setToUpdate(toUpdate === item ? undefined : item);
            }}
          >
            {item.is_personal_record && (
              <View className="absolute -translate-y-[1px]">
                <IconTrophy fill="gold" />
              </View>
            )}
            <View className="flex-1 items-center">
              <Text className="text-center text-lg">{index + 1}</Text>
            </View>
            <View className="flex-[2] flex flex-row items-center justify-center">
              <Text className="text-xl font-bold">{item.metric_weight}</Text>
              <Text className="text-base"> kgs</Text>
            </View>
            <View className="flex-1 flex flex-row items-center justify-center">
              <Text className="text-center text-xl font-bold">{item.reps}</Text>
              <Text className="text-base"> reps</Text>
            </View>
          </Pressable>
        )}
      />
    </Pressable>
  );
};

const ExerciseHistory: FunctionComponent<{ exercise: Exercise }> = ({
  exercise,
}) => {
  return (
    <View>
      <Text>History {exercise.name}</Text>
    </View>
  );
};

export const ExerciseLogNavigation: FunctionComponent<
  NativeStackScreenProps<RootStackParamList, "Exercise Log">
> = ({ navigation, route }) => {
  useEffect(() => {
    navigation.setOptions({ title: route.params.exercise.name });
  }, [route]);
  return (
    <Tab.Navigator>
      <Tab.Screen name="Track">
        {() => <TrackExercise exercise={route.params.exercise} />}
      </Tab.Screen>
      <Tab.Screen name="History">
        {() => <ExerciseHistory exercise={route.params.exercise} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};
