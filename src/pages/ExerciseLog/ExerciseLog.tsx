import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  FlatList,
  Keyboard,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { IconTrophy } from "tabler-icons-react-native";
import { RootStackParamList, SettingsContext } from "../../../App";
import { NumericInput } from "../../common/NumericInput";
import { Exercise, WeightUnits } from "../../database/models/Exercise";
import { TrainingLog } from "../../database/models/TrainingLog";
import { useFitnotesDB } from "../../database/useFitnotesDB";
import { fromCommonDate, kgToLb, lbToKg } from "../../helpers";

const Tab = createMaterialTopTabNavigator();

const TrackExercise: FunctionComponent<{ exercise: Exercise }> = ({
  exercise,
}) => {
  const [weight, setWeight] = useState<number>(0);
  const [reps, setReps] = useState<number>(0);
  const [time, setTime] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);

  const [toUpdate, setToUpdate] = useState<TrainingLog>();

  const { log, currLogs, deleteLog, updateLog } = useFitnotesDB();
  const DEFAULT_METRIC = useContext(SettingsContext).settings.defaultMetric;

  const kgs = (exercise.weight_unit === WeightUnits.DEFAULT && 

  const numMetrics =
    +exercise.uses_reps +
    +exercise.uses_weight +
    +exercise.uses_time +
    +exercise.uses_distance;

  const exerciseLogs = useMemo(
    () => currLogs.filter((log) => log.exercise._id === exercise._id),
    [currLogs, exercise]
  );

  useEffect(() => {
    if (toUpdate) {
      setReps(toUpdate.reps);
      setWeight(kgs ? toUpdate.metric_weight : kgToLb(toUpdate.metric_weight));
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
      className="w-full h-full flex items-center px-6 pt-2 bg-white"
    >
      {/* Weight */}
      <View className="w-full items-center justify-center flex-wrap flex flex-row">
        {exercise.uses_weight && (
          <View className="mt-4 px-2">
            <Text className={`text-lg font-bold text-center`}>Weight</Text>
            <View className="bg-slate-50">
              <NumericInput
                onChange={setWeight}
                value={weight}
                step={1.5}
                narrow={numMetrics > 2}
              />
            </View>
          </View>
        )}
        {/* Reps */}
        {exercise.uses_reps && (
          <View className="mt-4 px-2">
            <Text className="text-lg font-bold text-center">Reps</Text>
            <View className="bg-slate-50">
              <NumericInput
                onChange={setReps}
                value={reps}
                narrow={numMetrics > 2}
              />
            </View>
          </View>
        )}

        {/* Distance */}
        {exercise.uses_distance && (
          <View className="mt-4 px-2">
            <Text className="text-lg font-bold text-center">Distance</Text>
            <View className="bg-slate-50">
              <NumericInput
                onChange={setReps}
                value={reps}
                narrow={numMetrics > 2}
              />
            </View>
          </View>
        )}
        {/* Distance */}
        {exercise.uses_time && (
          <View className="mt-4 px-2">
            <Text className="text-lg font-bold text-center">Time</Text>
            <View className="bg-slate-50">
              <NumericInput
                onChange={setReps}
                value={reps}
                narrow={numMetrics > 2}
              />
            </View>
          </View>
        )}
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
            log(exercise, kgs ? weight : lbToKg(weight), reps);
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
              <Text className="text-xl font-bold">
                {kgs ? item.metric_weight : kgToLb(item.metric_weight)}
              </Text>
              <Text className="text-base">{kgs ? " kg" : " lb"}</Text>
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

const ExerciseHistory: FunctionComponent<{
  exercise: Exercise;
  navigation: NativeStackNavigationProp<RootStackParamList, "Exercise Log">;
}> = ({ exercise, navigation }) => {
  const { getExerciseLogs, setDate } = useFitnotesDB();

  const [logs, setLogs] = useState<TrainingLog[]>([]);

  useEffect(() => {
    getExerciseLogs(exercise).then(setLogs);
  }, [exercise, getExerciseLogs]);

  const dates = useMemo(() => {
    return new Set(logs.map((log) => log.date));
  }, [logs]);

  return (
    <ScrollView className="h-full w-full flex px-8 space-y-4 pt-4">
      {Array.from(dates.keys()).map((date, idx) => (
        <TouchableOpacity
          key={idx}
          className="w-full bg-white shadow-sm rounded-lg pb-2"
          onPress={() => {
            setDate(fromCommonDate(date));
            navigation.navigate("Home", {});
          }}
        >
          <View className="border-b-2 py-1 border-slate-200">
            <Text className="text-center text-lg font-bold border-slate-200">
              {fromCommonDate(date).toDateString()}
            </Text>
          </View>
          <View>
            {logs
              .filter((log) => log.date === date)
              .sort((a, b) => a._id - b._id)
              .map((log, _idx) => (
                <View key={_idx} className="flex flex-row mt-1">
                  {log.is_personal_record && (
                    <View className="absolute translate-y-[4px] left-5">
                      <IconTrophy fill="gold" size={18} />
                    </View>
                  )}
                  <View className="flex-grow flex flex-row justify-center items-center">
                    <Text className="text-center text-lg font-bold">
                      {log.metric_weight.toFixed(1)}
                    </Text>
                    <Text className="text-sm">
                      {log.exercise.unit_metric ? " kg" : " lb"}
                    </Text>
                  </View>
                  <View className="flex-grow flex flex-row justify-center items-center">
                    <Text className="text-center text-lg font-bold">
                      {log.reps}
                    </Text>
                    <Text className="text-sm"> reps</Text>
                  </View>
                </View>
              ))}
          </View>
        </TouchableOpacity>
      ))}
      <View className="h-8" />
    </ScrollView>
  );
};

export const ExerciseLogNavigation: FunctionComponent<
  NativeStackScreenProps<RootStackParamList, "Exercise Log">
> = ({ navigation, route }) => {
  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Edit Exercise", {
              exercise: route.params.exercise,
            });
          }}
        >
          <Text className="text-lg font-bold">
            {route.params.exercise.name}
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [route]);
  return (
    <Tab.Navigator>
      <Tab.Screen name="Track">
        {() => <TrackExercise exercise={route.params.exercise} />}
      </Tab.Screen>
      <Tab.Screen name="History">
        {() => (
          <ExerciseHistory
            exercise={route.params.exercise}
            navigation={navigation}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};
