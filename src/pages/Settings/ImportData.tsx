import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FunctionComponent } from "react";
import { RootStackParamList } from "../../../App";
import * as DocumentPicker from "expo-document-picker";
import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import { Text, TouchableOpacity, View } from "react-native";
import { useFitnotesDB } from "../../database/useFitnotesDB";
import { Category } from "../../database/models/Category";
import { TrainingLog } from "../../database/models/TrainingLog";
import { Exercise } from "../../database/models/Exercise";
import { ExerciseLogNavigation } from "../ExerciseLog/ExerciseLog";

export const ImportData: FunctionComponent<
  NativeStackScreenProps<RootStackParamList, "Import Data">
> = () => {
  const { manager, update, addCategory } = useFitnotesDB();

  const openDB = async () => {
    if (!manager) return;
    console.log("Importing fitnotes DB...");

    const file = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: false,
    });
    if (file.type === "success") {
      const sqliteDirectory = `${FileSystem.documentDirectory}SQLite`;
      const { exists } = await FileSystem.getInfoAsync(sqliteDirectory);

      if (!exists) {
        await FileSystem.makeDirectoryAsync(sqliteDirectory);
      }

      FileSystem.copyAsync({
        from: file.uri,
        to: `${sqliteDirectory}/fitnotes.db`,
      });
      const db = SQLite.openDatabase("fitnotes.db");

      await manager.clear(TrainingLog);
      await manager.clear(Exercise);
      await manager.clear(Category);
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM Category",
          [],
          async (tx, { rows: categoryRows }) => {
            categoryRows._array.forEach(
              async (category: {
                _id: number;
                colour: number;
                name: string;
                sort_order: number;
              }) => {
                const colour = `#${(category.colour >>> 0)
                  .toString(16)
                  .slice(2)
                  .padStart(6, "0")}`;
                const newCategory = await manager.create(Category, {
                  _id: category._id,
                  name: category.name,
                  colour,
                });
                const res = await manager.insert(Category, newCategory);
              }
            );
            tx.executeSql(
              "SELECT * FROM exercise",
              [],
              (tx, { rows: exerciseRows }) => {
                exerciseRows._array.forEach(
                  async (exercise: {
                    _id: number;
                    category_id: number;
                    name: string;
                    notes: string;
                  }) => {
                    const category = await manager.findOne(Category, {
                      where: { _id: exercise.category_id },
                    });
                    if (!category) {
                      console.error(
                        "NO CATEGORY FOUND FOR EXERCISE:",
                        exercise
                      );
                      return;
                    }
                    const newExercise = await manager.create(Exercise, {
                      _id: exercise._id,
                      name: exercise.name,
                      category: category,
                    });
                    const res = await manager.insert(Exercise, newExercise);
                  }
                );
                tx.executeSql(
                  "SELECT * from training_log",
                  [],
                  async (tx, { rows: logRows }) => {
                    logRows._array.forEach(
                      async (log: {
                        _id: number;
                        date: string;
                        exercise_id: number;
                        metric_weight: number;
                        reps: number;
                      }) => {
                        await manager.findOne(Exercise, {
                          where: { _id: log.exercise_id },
                        });
                        const exercise = await manager.findOneBy(Exercise, {
                          _id: log.exercise_id,
                        });

                        if (!exercise) {
                          console.log(
                            "Couldnt find exercise_id:",
                            log.exercise_id
                          );
                          return;
                        }
                        const newLog = await manager.create(TrainingLog, {
                          ...log,
                          exercise,
                        });
                        const res = await manager.insert(TrainingLog, newLog);
                        update();
                      }
                    );
                  }
                );
              }
            );
          }
        );
      });
    }
  };

  return (
    <View className="flex items-center w-full p-4">
      <TouchableOpacity
        className="h-10 w-48 bg-green-400 rounded-md items-center justify-center"
        onPress={openDB}
      >
        <Text className="text-lg font-bold text-slate-700">Select File</Text>
      </TouchableOpacity>
    </View>
  );
};
