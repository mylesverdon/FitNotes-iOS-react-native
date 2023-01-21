import React, { FunctionComponent } from "react";
import {
  FlatList,
  TouchableOpacity,
  View,
  Text,
  Pressable,
  Keyboard,
} from "react-native";
import { Exercise } from "../database/models/Exercise";
import * as Haptics from "expo-haptics";
import { IconCaretRight, IconCheck } from "tabler-icons-react-native";

interface IExerciseList {
  exerciseList: Exercise[];
  editable?: boolean;
  selectedExercise?: Exercise;
  exerciseSelected: (exercise?: Exercise) => void;
}

export const ExerciseList: FunctionComponent<IExerciseList> = ({
  exerciseList,
  editable = false,
  selectedExercise,
  exerciseSelected,
}) => {
  return (
    <FlatList
      onScrollBeginDrag={() => {
        Keyboard.dismiss();
      }}
      keyboardShouldPersistTaps="handled"
      data={exerciseList}
      getItemLayout={(data, index) => ({
        length: 49,
        offset: 49 * index,
        index,
      })}
      ListFooterComponent={<View className="h-14" />}
      renderItem={({ item: exercise }) => {
        return (
          <TouchableOpacity
            onPress={() => {
              exerciseSelected(
                selectedExercise?._id !== exercise._id ? exercise : undefined
              );
              // Haptics.selectionAsync();
            }}
            className={`w-full flex flex-row space-x-2 items-center h-12 border-b-[1px] border-slate-300 ${
              selectedExercise === exercise && "bg-blue-300"
            }`}
          >
            {editable ? (
              <View
                className="w-5 h-5 rounded-full flex flex-row items-center justify-center ml-3 mr-2"
                style={{ backgroundColor: exercise.category.colour }}
              >
                {selectedExercise === exercise && (
                  <IconCheck size={14} strokeWidth={3} color="white" />
                )}
              </View>
            ) : (
              <View
                className={`h-3 w-3 rounded-full ml-3 mr-2`}
                style={{ backgroundColor: exercise.category.colour }}
              />
            )}
            <Text
              numberOfLines={1}
              className="flex-grow flex-shrink text-lg min-w-0 text-ellipsis"
            >
              {exercise.name}
            </Text>

            {!editable && <IconCaretRight strokeWidth={0} fill="grey" />}
          </TouchableOpacity>
        );
      }}
    />
  );
};
