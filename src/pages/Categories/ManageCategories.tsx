import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { FunctionComponent, useEffect, useState } from "react";
import {
  Keyboard,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import {
  IconCheck,
  IconColorPicker,
  IconPencil,
  IconPlus,
} from "tabler-icons-react-native";
import { RootStackParamList } from "../../../App";
import { Category } from "../../database/models/Category";
import { TrainingLog } from "../../database/models/TrainingLog";
import { useFitnotesDB } from "../../database/useFitnotesDB";
import { HueSelector } from "./HueSelector";

export const ManageCategories: FunctionComponent<
  NativeStackScreenProps<RootStackParamList, "Manage Categories">
> = ({ navigation }) => {
  const {
    categories,
    addCategory,
    exercises,
    getExerciseLogs,
    deleteExercise,
    manager,
    update,
  } = useFitnotesDB();

  const [name, setName] = useState<string>();
  const [color, setColor] = useState<string>();

  const [selectedCategory, setSelectedCategory] = useState<Category>();

  useEffect(() => {
    setName(selectedCategory?.name);
    setColor(selectedCategory?.colour);
  }, [selectedCategory]);

  const add = async () => {
    if (!name || !color) {
      alert("All fields required");
    } else {
      const res = await addCategory(name, color);
      if (!res) {
        alert("Category already exists!");
      }
    }
  };
  const _delete = async () => {
    if (!selectedCategory || !manager) return;
    const exercisesToDelete = exercises.filter(
      (exercise) => exercise.category._id === selectedCategory._id
    );
    const logsToDelete = await Promise.all(
      exercisesToDelete.map((exercise) => {
        return getExerciseLogs(exercise);
      })
    );
    const flatLogsToDelete = logsToDelete.flat();
    Alert.alert(
      "Delete?",
      `${
        flatLogsToDelete.length > 0
          ? `This will also remove\n${exercisesToDelete.length} exercises\nand ${flatLogsToDelete.length} logs.\n`
          : exercisesToDelete.length > 0
          ? `This will also remove\n${exercisesToDelete.length} exercises.\n`
          : ""
      }Are you sure you want to delete this category?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            if (logsToDelete.length > 0) {
              await manager.delete(
                TrainingLog,
                flatLogsToDelete.map((log) => log._id)
              );
            }
            await Promise.all(
              exercisesToDelete.map((exercise) => deleteExercise(exercise))
            );
            const res2 = await manager.delete(Category, [selectedCategory._id]);
            if (res2) {
              setSelectedCategory(undefined);
              setName(undefined);
              setColor("#FF0000");
              update();
            }
          },
          style: "destructive",
        },
      ]
    );
  };
  const _update = async () => {
    Keyboard.dismiss();
    if (!selectedCategory || !manager) return;
    if (!name || !color) {
      alert("All fields required!");
      return;
    }
    console.log(name, color);
    const res = await manager.save(Category, {
      _id: selectedCategory._id,
      name,
      colour: color,
    });
    update();

    if (res) {
      setName(undefined);
      setColor("#FF0000");
      setSelectedCategory(undefined);
      return true;
    } else {
      alert("Failed");
      return false;
    }
  };

  return (
    <View className="w-full h-full flex space-y-4 p-4">
      <View className="p-4 rounded-lg bg-white flex space-y-2">
        <View className="bg-slate-100 p-2 rounded-lg flex flex-row items-center space-x-2">
          <IconPencil size={16} color="#AAAAAA" />
          <TextInput
            value={name}
            placeholderTextColor={"#94A3B8"}
            onChangeText={setName}
            placeholder="Name"
            style={{ fontSize: 18 }}
            className="flex-grow"
          />
        </View>
        <View className="bg-slate-100 rounded-lg flex flex-row items-center">
          <View className="flex flex-row p-2 space-x-2 items-center">
            <IconColorPicker size={16} color="#AAAAAA" />
            <Text className="text-lg text-[#94A3B8]">Color</Text>
          </View>
          <View className="flex-grow py-2">
            <HueSelector
              color={color ?? "#FF0000"}
              onChange={(col) => {
                Keyboard.dismiss();
                setColor(col);
              }}
            />
          </View>
        </View>
        <View className="flex flex-row space-x-4">
          {/* BUTTONS */}
          {selectedCategory ? (
            selectedCategory.name === name &&
            selectedCategory.colour === color ? (
              <>
                {/*  */}
                <TouchableOpacity
                  className="flex-1 h-10 rounded-lg border-2 border-slate-400 justify-center items-center"
                  onPress={() => {
                    setSelectedCategory(undefined);
                    setName(undefined);
                    setColor("#FF0000");
                  }}
                >
                  <Text className="text-lg">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 h-10 rounded-lg bg-red-300 justify-center items-center"
                  onPress={_delete}
                >
                  <Text className="text-lg text-red-900">Delete</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  className="flex-1 h-10 rounded-lg border-2 border-slate-400 justify-center items-center"
                  onPress={() => {
                    setSelectedCategory(undefined);
                    setName(undefined);
                    setColor("#FF0000");
                  }}
                >
                  <Text className="text-lg">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 h-10 rounded-lg bg-purple-300 justify-center items-center"
                  onPress={_update}
                >
                  <Text className="text-lg">Update</Text>
                </TouchableOpacity>
              </>
            )
          ) : (
            <TouchableOpacity
              className="flex-1 flex-row space-x-1 h-10 rounded-lg bg-green-400 justify-center items-center"
              onPress={add}
            >
              <Text className="text-lg">Add</Text>
              <IconPlus size={18} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View
        className="pb-10 px-2 bg-white rounded-lg flex-shrink"
        onTouchStart={Keyboard.dismiss}
      >
        <FlatList
          data={categories}
          renderItem={({ item: category }) => {
            return (
              <TouchableOpacity
                className={`w-full flex flex-row space-x-2 items-center h-12 border-b-[1px] border-slate-300 ${
                  selectedCategory?._id === category._id && "bg-blue-300"
                }`}
                onPress={() => {
                  setSelectedCategory(
                    selectedCategory === category ? undefined : category
                  );
                }}
              >
                <View
                  className="w-5 h-5 rounded-full flex flex-row items-center justify-center ml-3 mr-2"
                  style={{ backgroundColor: category.colour }}
                >
                  {selectedCategory === category && (
                    <IconCheck size={14} strokeWidth={3} color="white" />
                  )}
                </View>
                <Text
                  numberOfLines={1}
                  className="flex-grow flex-shrink text-lg min-w-0 text-ellipsis"
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </View>
  );
};
