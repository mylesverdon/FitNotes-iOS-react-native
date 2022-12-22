import React, { FunctionComponent, useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Touchable,
  TouchableOpacity,
} from "react-native";
import { Icon } from "@rneui/base";
import { useFitnotesDB } from "../../database/useFitnotesDB";
import { NavigationButton } from "../../common/NavigationButton";
import { TrainingLog } from "../../database/models/TrainingLog";
import {
  IconCaretLeft,
  IconCaretRight,
  IconPlus,
  IconReload,
} from "tabler-icons-react-native";
import { DateSelect } from "./DateSelect";
import { Exercise } from "../../database/models/Exercise";
import { toCommonDate } from "../../helpers";

export const Home: FunctionComponent = () => {
  const fitnotesDB = useFitnotesDB();
  const [trainingLogs, setTrainingLogs] = useState<TrainingLog[]>([]);
  const [date, setDate] = useState<Date>(new Date());

  useEffect(() => {
    updateList();
  }, [fitnotesDB]);

  const updateList = async () => {
    if (!fitnotesDB) return;
    setTrainingLogs(await fitnotesDB.getAllLogs());
  };

  const addExercise = () => {
    //exercise: Exercise, date: Date
    toCommonDate(new Date(Date.now()));
    // fitnotesDB?.addExercise(new TrainingLog(exercise, "2022-01-01", 100, 10));
  };

  useEffect(() => {}, [date]);

  return (
    <>
      <SafeAreaView className="h-full flex border-2">
        <View className="flex flex-row bg-slate-800 px-2 items-center ">
          <NavigationButton onPress={() => {}}>
            <Icon name="menu" type="entypo" color="white" />
          </NavigationButton>

          <Text className="text-xl text-white flex-grow font-bold">
            Fit Logs
          </Text>

          <NavigationButton onPress={addExercise}>
            <IconPlus color="white" />
          </NavigationButton>

          <NavigationButton
            onPress={() => {
              updateList();
            }}
          >
            <IconReload color="white" />
          </NavigationButton>
        </View>
        <DateSelect date={date} onDateChange={setDate} />
        <View className="flex-grow">
          {trainingLogs.map((log, idx) => (
            <View key={idx}>
              <Text>{log.exercise}</Text>
            </View>
          ))}
        </View>
      </SafeAreaView>
    </>
  );
};
