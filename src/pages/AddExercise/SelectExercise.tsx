import React, { FunctionComponent, useEffect, useMemo, useState } from "react";
import {
  Keyboard,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Button,
} from "react-native";
import { Category } from "../../database/models/Category";
import { useFitnotesDB } from "../../database/useFitnotesDB";
import { SearchBar } from "../../common/SearchBar";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../App";
import { IconCaretRight, IconCheck } from "tabler-icons-react-native";
import { ManageExercises } from "./ManageExercises";
import { Exercise } from "../../database/models/Exercise";
import * as Haptics from "expo-haptics";
import { ExerciseList } from "../../common/ExerciseList";

export const SelectExercise: FunctionComponent<
  NativeStackScreenProps<RootStackParamList, "Select Exercise">
> = ({ navigation }) => {
  const { exercises, categories } = useFitnotesDB();

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

  useEffect(() => {
    navigation.setOptions({});
  }, []);

  return (
    <View className="h-full flex flex-col space-y-4 p-4 pb-0">
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
      <View className="px-2 bg-white rounded-lg flex-shrink">
        <ExerciseList
          exerciseList={filteredExerciseList}
          exerciseSelected={(exercise) => {
            if (exercise) {
              navigation.replace("Exercise Log", { exercise });
            }
          }}
        />
      </View>
    </View>
  );
};
