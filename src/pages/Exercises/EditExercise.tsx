import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { FunctionComponent, ReactNode, useCallback, useEffect, useState } from "react";
import {
  TextInput,
  TouchableOpacity,
  View,
  Text,
  Keyboard,
  ScrollView,
  Button,
  Pressable,
  Alert,
  Switch,
} from "react-native";
import {
  Icon123,
  IconCaretDown,
  IconClock,
  IconDeviceWatch,
  IconPencil,
  IconPlus,
  IconRulerMeasure,
  IconWeight,
  TablerIcon,
} from "tabler-icons-react-native";
import { RootStackParamList } from "../../../App";
import { Category } from "../../database/models/Category";
import { useFitnotesDB } from "../../database/useFitnotesDB";
import { NumberInput } from "../../common/NumericInput";
import { DistanceUnit, Exercise, TimeUnit, WeightUnit } from "../../database/models/Exercise";
import { TrainingLog } from "../../database/models/TrainingLog";

export const EditExercise: FunctionComponent<
  NativeStackScreenProps<RootStackParamList, "Edit Exercise">
> = ({ navigation, route }) => {
  const { categories, manager, update } = useFitnotesDB();

  const [exercise, setExercise] = useState<Exercise>();

  // Exercise details
  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<Category>();
  const [weightUnit, setWeightUnit] = useState<WeightUnit>(WeightUnit.DEFAULT);
  const [weightIncrement, setWeightIncrement] = useState<number | undefined>();
  const [distanceUnit, setDistanceUnit] = useState<DistanceUnit>(DistanceUnit.DEFAULT);
  const [distanceIncrement, setDistanceIncrement] = useState<number | undefined>();
  const [timeUnit, setTimeUnit] = useState<TimeUnit>(TimeUnit.DEFAULT);
  const [timeIncrement, setTimeIncrement] = useState<number | undefined>();
  const [notes, setNotes] = useState<string>("");
  const [tracksWeight, setTracksWeight] = useState<boolean>(false);
  const [tracksReps, setTracksReps] = useState<boolean>(false);
  const [tracksDistance, setTracksDistance] = useState<boolean>(false);
  const [tracksTime, setTracksTime] = useState<boolean>(false);

  const depArr = [
    exercise,
    category,
    manager,
    name,
    weightUnit,
    weightIncrement,
    distanceUnit,
    timeUnit,
    notes,
    tracksReps,
    tracksDistance,
    tracksTime,
    tracksWeight,
  ];

  const updateExercise = useCallback(async () => {
    if (!exercise || !category || !manager) {
      console.log("Failed");
      return;
    }
    const res = await manager.update(
      Exercise,
      { _id: exercise._id },
      {
        name,
        category,
        weight_unit: weightUnit,
        weight_increment: increment,
        disatnce_unit: disatnceUnit,
        disatnce_increment: increment,
        notes: notes ?? "",
        uses_reps: tracksReps,
        uses_weight: tracksWeight,
        uses_distance: tracksDistance,
        uses_time: tracksTime,
      }
    );
    if (res) {
      update();
      navigation.goBack();
    }
  }, depArr);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <Button title="Cancel" onPress={navigation.goBack} />,
      headerRight: () => <Button title="Save" onPress={updateExercise} />,
    });
  }, depArr);

  useEffect(() => {
    const { exercise: _exercise } = route.params;
    setExercise(_exercise);
    setName(_exercise.name);
    setCategory(_exercise.category);
    setWeightUnit(_exercise.weight_unit);
    setIncrement(_exercise.weight_increment);
    setNotes(_exercise.notes);
    setTracksReps(_exercise.uses_reps);
    setTracksWeight(_exercise.uses_weight);
    setTracksTime(_exercise.uses_time);
    setTracksDistance(_exercise.uses_distance);
  }, [route]);

  // Component state
  const [categorySelectOpen, setCategorySelectOpen] = useState(false);

  const _delete = useCallback(async () => {
    if (!manager || !exercise) return;

    const logsToDelete = await manager.find(TrainingLog, {
      where: { exercise: { _id: exercise._id } },
    });

    Alert.alert(
      "Delete exercise?",
      `This will also delete ${logsToDelete.length} logs for this exercise.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            if (logsToDelete.length > 0) {
              await manager.delete(TrainingLog, logsToDelete);
            }
            await manager.delete(Exercise, exercise?._id);
            update();
            navigation.goBack();
          },
        },
      ]
    );
  }, [exercise, manager]);

  return (
    <Pressable
      className="w-full h-full px-6"
      onPress={() => {
        Keyboard.dismiss();
        setCategorySelectOpen(false);
      }}
    >
      {/* Details */}
      <View className="flex p-2 bg-white rounded-lg z-20 mt-6">
        {/* Name */}
        <View className="flex flex-row items-center space-x-3  pr-1 border-b-[1px] border-slate-200 pb-1">
          <Text className="w-24 text-lg pl-1">Name</Text>
          <TextInput
            value={name}
            placeholderTextColor={"#94A3B8"}
            onChangeText={setName}
            placeholder="Name"
            style={{ fontSize: 18 }}
            onPressIn={() => {
              setCategorySelectOpen(false);
            }}
          />
        </View>
        {/* Category */}
        <TouchableOpacity
          className="flex flex-row items-center space-x-3 pt-1 pr-1"
          onPress={() => {
            Keyboard.dismiss();
            setCategorySelectOpen(!categorySelectOpen);
          }}
        >
          <Text className="w-24 text-lg pl-1 ">Category</Text>
          <View
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: category?.colour }}
          ></View>
          <Text className="flex-grow text-lg">{category?.name}</Text>
          <IconCaretDown stroke={0} fill="#CCCCCC" />
          {categorySelectOpen && (
            <>
              <View className="absolute top-8 border-8  border-slate-300 border-x-transparent border-t-transparent border-b-8 rounded-t-full right-2 w-0 h-0" />
              <ScrollView
                className="absolute top-12 left-4 -right-2 bg-white rounded-lg p-2 max-h-100 border-[1px] border-slate-200"
                onScrollBeginDrag={() => {
                  Keyboard.dismiss();
                }}
              >
                {categories.map((_category, idx) => (
                  <TouchableOpacity
                    className={`py-1.5 flex flex-row items-center space-x-4 pl-2 ${
                      idx !== 0 && "border-t-[1px] border-slate-300"
                    }`}
                    onPress={() => {
                      setCategory(_category);
                      setCategorySelectOpen(false);
                    }}
                    key={idx}
                  >
                    <View
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: _category.colour }}
                    />
                    <Text className="text-base" key={_category._id}>
                      {_category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  className="mt-1 pt-2 pl-2 border-t-[2px] border-slate-300 flex flex-row items-center space-x-4"
                  onPress={() => {
                    navigation.navigate("Manage Categories", {});
                    setCategorySelectOpen(false);
                  }}
                >
                  <View className="w-3">
                    <IconPencil className="-translate-x-0.5" size={16} color="#AAAAAA" />
                  </View>
                  <Text className="text-base">Manage categories</Text>
                </TouchableOpacity>
              </ScrollView>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Defaults */}
      <Text className="pt-3 pl-1 text-base">Metrics</Text>
      <View className="flex p-2 bg-white rounded-lg">
        {/* Weight */}
        <View
          className={`flex flex-row items-center space-x-3 pt-1 pr-1 ${
            tracksWeight && "border-b-[1px] border-slate-200 pb-2"
          }`}
        >
          <View className="flex justify-center items-center rounded-lg w-8 h-8 bg-green-500">
            <IconWeight color="white" strokeWidth={1} />
          </View>
          <View className="flex-grow">
            <Text className="text-lg">Weight</Text>
          </View>
          <Switch value={tracksWeight} onChange={(ev) => setTracksWeight(ev.nativeEvent.value)} />
        </View>
        {tracksWeight && (
          <>
            <View className="flex flex-row items-center space-x-3 pt-1 pr-1 border-b-[1px] border-slate-200 pb-2">
              <View className="flex justify-center items-center rounded-lg w-8 h-8 bg-green-500">
                <IconWeight color="white" strokeWidth={1} />
              </View>
              <View className="flex-grow">
                <Text className="text-lg">Units</Text>
              </View>
              <View className="flex flex-row items-center bg-slate-100 rounded-lg">
                <Pressable
                  className={`w-18 px-2 py-1 rounded-lg ${
                    unit === "Default" ? "bg-blue-300 shadow-sm" : ""
                  }`}
                  onPress={() => setUnit("Default")}
                >
                  <Text className="text-lg text-center">Default</Text>
                </Pressable>
                <View className="h-4 border-l-[1px] border-slate-200" />
                <Pressable
                  className={`w-12 px-2 py-1 rounded-lg ${
                    unit === "Kg" ? "bg-blue-300 shadow-sm" : ""
                  }`}
                  onPress={() => setUnit("Kg")}
                >
                  <Text className="text-lg text-center">Kg</Text>
                </Pressable>
                <View className="h-4 border-l-[1px] border-slate-200" />
                <Pressable
                  className={`w-12 px-2 py-1 rounded-lg ${
                    unit === "Lb" ? "bg-blue-300 shadow-sm" : ""
                  }`}
                  onPress={() => setUnit("Lb")}
                >
                  <Text className="text-lg text-center">Lb</Text>
                </Pressable>
              </View>
            </View>
            {/* Default Units */}
            <View className="flex flex-row items-center space-x-3 pt-2 pr-1 ">
              <View className="flex justify-center items-center rounded-lg w-8 h-8 bg-green-500">
                <IconPlus color="white" strokeWidth={1} />
              </View>
              <View className="flex-grow">
                <Text className="text-lg">Increment</Text>
              </View>
              <View className="flex flex-row items-center bg-slate-100 rounded-lg">
                <NumberInput value={increment} onChange={setIncrement} placeholder="Default" />
              </View>
            </View>
          </>
        )}

        <SettingField
          name="Track Reps"
          Icon={Icon123}
          component={<Switch value={tracksReps} onValueChange={setTracksReps} />}
        />
        <SettingField
          name="Track Time"
          Icon={IconClock}
          component={<Switch value={tracksTime} onValueChange={setTracksTime} />}
        />
        <SettingField
          name="Track Distance"
          Icon={IconRulerMeasure}
          component={<Switch value={tracksDistance} onValueChange={setTracksDistance} />}
        />
      </View>

      {/* Notes */}
      <Text className="pt-3 pl-1 text-base">Notes</Text>
      <View className="flex p-4 pt-3 bg-white rounded-lg max-h-32">
        <TextInput
          className="w-full"
          multiline
          value={notes}
          onChangeText={setNotes}
          style={{ fontSize: 18 }}
          placeholder="No notes"
          scrollEnabled
        />
      </View>

      <TouchableOpacity
        className="flex items-center justify-center mt-8 py-3 bg-red-200 rounded-lg h-12"
        onPress={_delete}
      >
        <Text className="text-black text-base">Delete</Text>
      </TouchableOpacity>
    </Pressable>
  );
};

export const SettingField: FunctionComponent<{
  name: string;
  Icon: TablerIcon;
  component: ReactNode;
}> = ({ name, Icon, component }) => {
  return (
    <View className="flex flex-row items-center space-x-3 pt-2 pr-1">
      <View className="flex justify-center items-center rounded-lg w-8 h-8 bg-green-500">
        <Icon color="white" strokeWidth={1} />
      </View>
      <View className="flex-grow">
        <Text className="text-lg">{name}</Text>
      </View>
      {component}
    </View>
  );
};
