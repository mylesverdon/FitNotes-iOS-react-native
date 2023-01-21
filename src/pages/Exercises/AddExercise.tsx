import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  Button,
  Keyboard,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  IconCaretDown,
  IconPencil,
  IconPlus,
  IconWeight,
} from "tabler-icons-react-native";
import { RootStackParamList } from "../../../App";
import { NumberInput } from "../../common/NumericInput";
import { Category } from "../../database/models/Category";
import { Exercise } from "../../database/models/Exercise";
import { useFitnotesDB } from "../../database/useFitnotesDB";

export const AddExercise: FunctionComponent<
  NativeStackScreenProps<RootStackParamList, "Add Exercise">
> = ({ navigation }) => {
  const { categories, manager, update } = useFitnotesDB();

  // Exercise details
  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<Category>();
  const [unit, setUnit] = useState<"Default" | "Kg" | "Lb">("Default");
  const [increment, setIncrement] = useState<number | undefined>();
  const [notes, setNotes] = useState<string>();

  const updateExercise = useCallback(async () => {
    if (!category || !manager) {
      console.log("Failed");
      return;
    }

    const res = await manager.insert(Exercise, {
      name,
      category,
      default_unit: unit === "Default",
      unit_metric: unit !== "Lb",
      weight_increment: increment,
      notes: notes ?? "",
    });
    if (res) {
      update();
      navigation.goBack();
    }
  }, [manager, name, category, increment, unit, notes]);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <Button title="Cancel" onPress={navigation.goBack} />,
      headerRight: () => <Button title="Add" onPress={updateExercise} />,
    });
  }, [manager, name, category, increment, unit, notes]);

  // Component state
  const [categorySelectOpen, setCategorySelectOpen] = useState(false);

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
            className="flex-grow"
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
          <Text className="w-24 text-lg pl-1">Category</Text>
          {category ? (
            <View className="flex flex-row items-center space-x-3 flex-shrink">
              <View
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: category?.colour }}
              ></View>
              <Text className="flex-grow text-lg">{category?.name}</Text>
            </View>
          ) : (
            <Text className="flex-grow text-lg text-[#94A3B8]">Category</Text>
          )}
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
                    <IconPencil
                      className="-translate-x-0.5"
                      size={16}
                      color="#AAAAAA"
                    />
                  </View>
                  <Text className="text-base">Manage categories</Text>
                </TouchableOpacity>
              </ScrollView>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Defaults */}
      <Text className="pt-3 pl-1 text-base">Defaults</Text>
      <View className="flex p-2 bg-white rounded-lg">
        {/* Default Units */}
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
                unit === "Default" ? "bg-blue-400" : ""
              }`}
              onPress={() => setUnit("Default")}
            >
              <Text className="text-lg text-center">Default</Text>
            </Pressable>
            <View className="h-4 border-l-[1px] border-slate-200" />
            <Pressable
              className={`w-12 px-2 py-1 rounded-lg ${
                unit === "Kg" ? "bg-blue-400" : ""
              }`}
              onPress={() => setUnit("Kg")}
            >
              <Text className="text-lg text-center">Kg</Text>
            </Pressable>
            <View className="h-4 border-l-[1px] border-slate-200" />
            <Pressable
              className={`w-12 px-2 py-1 rounded-lg ${
                unit === "Lb" ? "bg-blue-400" : ""
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
            <NumberInput
              value={increment}
              onChange={setIncrement}
              placeholder="Default"
              clearable
              nonZero
            />
          </View>
        </View>
      </View>

      {/* Notes */}
      <Text className="pt-3 pl-1 text-base">Notes</Text>
      <View className="flex p-4 bg-white rounded-lg max-h-32">
        <TextInput
          multiline
          value={notes}
          onChangeText={setNotes}
          style={{ fontSize: 18 }}
          placeholder="No notes"
          scrollEnabled
        />
      </View>
    </Pressable>
  );
};
