import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { FunctionComponent, useEffect, useMemo, useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Keyboard,
  ScrollView,
  Alert,
  SafeAreaView,
  Pressable,
  Button,
} from "react-native";
import {
  IconCaretDown,
  IconPencil,
  IconPlus,
  IconSearch,
  IconSortAscending,
} from "tabler-icons-react-native";
import { RootStackParamList } from "../../../App";
import { ExerciseList } from "../../common/ExerciseList";
import { SearchBar } from "../../common/SearchBar";
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

  const [selectedExercise, setSelectedExercise] = useState<Exercise>();

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
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const [searchString, setSearchString] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<Category>();

  const filteredExerciseList = useMemo(() => {
    let _filteredExercises = exercises;

    if (selectedCategory) {
      _filteredExercises = _filteredExercises.filter(
        (exercise) => exercise.category._id === selectedCategory._id
      );
    }

    if (searchString) {
      _filteredExercises = _filteredExercises.filter((exercise) =>
        exercise.name.toLowerCase().includes(searchString.toLowerCase())
      );
    }

    return _filteredExercises.sort((a, b) => {
      return ("" + a.name).localeCompare(b.name);
    });
  }, [selectedCategory, searchString, exercises]);

  const [dropDownOpen, setDropDownOpen] = useState(false);

  return (
    <View className="h-full bg-white flex">
      <View className="bg-white p-4 rounded-lg z-10">
        <SearchBar
          placeholder="Exercise"
          text={searchString}
          onTextChange={setSearchString}
          categories={categories}
          onCategorySelect={setSelectedCategory}
          category={selectedCategory}
          dropDownOpen={dropDownOpen}
          setDropDownOpen={setDropDownOpen}
        />
      </View>
      <View
        className="px-4 flex-shrink"
        onTouchStart={() => {
          setDropDownOpen(false);
        }}
      >
        <ExerciseList
          exerciseList={filteredExerciseList}
          exerciseSelected={(exercise) => {
            if (exercise) {
              navigation.navigate("Edit Exercise", { exercise });
            }
          }}
          editable={false}
          selectedExercise={selectedExercise}
        />
      </View>
    </View>
  );
};
