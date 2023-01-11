import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { FunctionComponent, useEffect, useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Keyboard,
  ScrollView,
  Alert,
} from "react-native";
import {
  IconCaretDown,
  IconPencil,
  IconPlus,
  IconSearch,
} from "tabler-icons-react-native";
import { RootStackParamList } from "../../../App";
import { ExerciseList } from "../../common/ExerciseList";
import { Category } from "../../database/models/Category";
import { Exercise } from "../../database/models/Exercise";
import { TrainingLog } from "../../database/models/TrainingLog";
import { useFitnotesDB } from "../../database/useFitnotesDB";

export const ManageExercises: FunctionComponent<
  NativeStackScreenProps<RootStackParamList, "Manage Exercises">
> = ({ navigation }) => {
  const {
    getExerciseLogs,
    exercises,
    categories,
    addExercise,
    deleteExercise,
    manager,
    update,
  } = useFitnotesDB();

  const [name, setName] = useState<string>();
  const [category, setCategory] = useState<Category>();

  const [selectedExercise, setSelectedExercise] = useState<Exercise>();

  const [categorySelectOpen, setCategorySelectOpen] = useState<boolean>(false);

  useEffect(() => {
    setName(selectedExercise?.name);
    setCategory(selectedExercise?.category);
  }, [selectedExercise]);

  const add = async () => {
    if (!name || !category) {
      alert("All fields required");
    } else {
      setName(undefined);
      setCategory(undefined);
      const res = await addExercise(name, category);
      if (!res) {
        alert("Exercise already exists!");
      }
    }
  };

  const _delete = async () => {
    if (!selectedExercise || !manager) return;
    const logsToDelete = await getExerciseLogs(selectedExercise);
    Alert.alert(
      "Delete?",
      `${
        logsToDelete.length > 0
          ? `This will also remove ${logsToDelete.length} related logs.\n`
          : ""
      }Are you sure you want to delete this exercise?`,
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
                logsToDelete.map((log) => log._id)
              );
            }
            const res = await deleteExercise(selectedExercise);
            if (res) {
              setSelectedExercise(undefined);
              setName(undefined);
              setCategory(undefined);
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const _update = async (): Promise<boolean | undefined> => {
    Keyboard.dismiss();
    if (!selectedExercise || !manager) return;
    if (!name || !category) {
      alert("All categories required!");
      return;
    }

    const res = await manager.save(Exercise, {
      _id: selectedExercise._id,
      name,
      category,
    });
    update();

    if (res) {
      setName(undefined);
      setCategory(undefined);
      return true;
    } else {
      alert("Failed");
      return false;
    }
  };

  return (
    <View className="h-full flex flex-col space-y-4 p-4 pb-0">
      <View className="bg-white p-4 rounded-lg z-10">
        <View className="flex space-y-2">
          <View className="bg-slate-100 p-2 rounded-lg flex flex-row items-center space-x-2">
            <IconPencil size={16} color="#AAAAAA" />
            <TextInput
              value={name}
              placeholderTextColor={"#94A3B8"}
              onChangeText={setName}
              placeholder="Name"
              style={{ fontSize: 18 }}
              className="flex-grow"
              onPressIn={() => {
                setCategorySelectOpen(false);
              }}
            />
          </View>
          <View className="z-10">
            <TouchableOpacity
              className={`bg-slate-100 p-2 flex flex-row items-center space-x-2 ${
                categorySelectOpen ? "rounded-t-lg" : "rounded-lg"
              }`}
              onPress={() => {
                Keyboard.dismiss();
                setCategorySelectOpen(!categorySelectOpen);
              }}
            >
              {category ? (
                <View
                  className="w-3 h-3 rounded-full mr-[3px]"
                  style={{ backgroundColor: category.colour }}
                />
              ) : (
                <IconSearch size={16} color="#AAAAAA" />
              )}
              <Text
                className={`flex-grow text-[18px] ${
                  category ? "text-black" : "text-slate-400"
                }`}
              >
                {category?.name ?? "Category"}
              </Text>
              <IconCaretDown color="#94A3B8" fill="#94A3B8" />
            </TouchableOpacity>
            {categorySelectOpen && (
              <ScrollView className="absolute top-12 right-0 w-4/5 bg-slate-200 rounded-lg p-2 max-h-100">
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
            )}
          </View>
          <View className="flex flex-row space-x-4">
            {/* BUTTONS */}
            {selectedExercise ? (
              selectedExercise.name === name &&
              selectedExercise.category._id === category?._id ? (
                <>
                  {/*  */}
                  <TouchableOpacity
                    className="flex-1 h-10 rounded-lg border-2 border-slate-400 justify-center items-center"
                    onPress={() => {
                      setSelectedExercise(undefined);
                      setName(undefined);
                      setCategory(undefined);
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
                      setSelectedExercise(undefined);
                      setName(undefined);
                      setCategory(undefined);
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
      </View>
      <View className="px-2 bg-white rounded-lg flex-shrink">
        <ExerciseList
          exerciseList={exercises}
          exerciseSelected={(exercise) => {
            setSelectedExercise(exercise);
          }}
          editable={true}
          selectedExercise={selectedExercise}
        />
      </View>
    </View>
  );
};
