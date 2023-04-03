import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { FunctionComponent, useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  Pressable,
  Keyboard,
} from "react-native";
import {
  IconBarbell,
  IconCaretRight,
  IconDatabaseImport,
  IconFolders,
  IconWeight,
} from "tabler-icons-react-native";
import { RootStackParamList, SettingsContext } from "../../../App";
import { NumberInput } from "../../common/NumericInput";
import { useFitnotesDB } from "../../database/useFitnotesDB";

export const Settings: FunctionComponent<
  NativeStackScreenProps<RootStackParamList, "Settings">
> = ({ navigation }) => {
  const { settings, updateSettings } = useContext(SettingsContext);
  const { clearDB } = useFitnotesDB();

  return (
    <Pressable
      className="w-full h-full flex px-8 pt-6"
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      {/* Manage things */}
      <View className="flex p-2 bg-white rounded-lg">
        {/* Manage Exercises */}
        <TouchableOpacity
          className="flex flex-row items-center space-x-3 border-b-[1px] border-slate-100 pb-1"
          onPress={() => {
            navigation.navigate("Manage Exercises", {});
            Keyboard.dismiss();
          }}
        >
          <View className="flex justify-center items-center rounded-md w-8 h-8 bg-blue-600">
            <IconBarbell color="white" strokeWidth={1} />
          </View>
          <View className="flex-grow">
            <Text className="text-lg">Manage Exercises</Text>
          </View>
          <IconCaretRight strokeWidth={0} fill="grey" />
        </TouchableOpacity>
        {/* Manage Categories */}
        <TouchableOpacity
          className="flex flex-row items-center space-x-3 pt-1"
          onPress={() => {
            navigation.navigate("Manage Categories", {});
            Keyboard.dismiss();
          }}
        >
          <View className="flex justify-center items-center rounded-md w-8 h-8 bg-blue-600">
            <IconFolders color="white" strokeWidth={1} />
          </View>
          <View className="flex-grow">
            <Text className="text-lg">Manage Categories</Text>
          </View>
          <IconCaretRight strokeWidth={0} fill="grey" />
        </TouchableOpacity>
      </View>

      {/* Defaults */}
      <Text className="pt-3 pl-1 text-base">Defaults</Text>
      <View className="flex p-2 bg-white rounded-lg">
        {/* Default Units */}
        <View className="flex flex-row items-center space-x-3 pr-1 border-b-[1px] border-slate-100 pb-1">
          <View className="flex justify-center items-center rounded-md w-8 h-8 bg-green-500">
            <IconWeight color="white" strokeWidth={1} />
          </View>
          <View className="flex-grow">
            <Text className="text-lg">Units</Text>
          </View>
          <Text className="text-base">Lb</Text>
          <Switch
            value={settings.defaultMetric}
            onValueChange={(val) => {
              updateSettings({ defaultMetric: val });
            }}
          />
          <Text className="text-base">Kg</Text>
        </View>
        {/* Default Kg increment */}
        <View className="flex flex-row items-center space-x-3 pt-1 pr-1 border-b-[1px] border-slate-100 pb-1">
          <View className="flex justify-center items-center rounded-md w-8 h-8 bg-green-500">
            <IconWeight color="white" strokeWidth={1} />
          </View>
          <View className="flex-grow">
            <Text className="text-lg">Kg Increment</Text>
          </View>
          <View className="bg-slate-100 rounded-md">
            <NumberInput
              value={settings.metricIncrement}
              onChange={(val) =>
                updateSettings({ metricIncrement: val ?? 2.5 })
              }
              placeholder={"2.5"}
              nonZero
            />
          </View>
        </View>
        {/* Default Lb increment */}
        <View className="flex flex-row items-center space-x-3 pt-1 pr-1">
          <View className="flex justify-center items-center rounded-md w-8 h-8 bg-green-500">
            <IconWeight color="white" strokeWidth={1} />
          </View>
          <View className="flex-grow">
            <Text className="text-lg">Lb Increment</Text>
          </View>
          <View className="bg-slate-100 rounded-md">
            <NumberInput
              value={settings.imperialIncrement}
              onChange={(val) =>
                updateSettings({ imperialIncrement: val ?? 2.5 })
              }
              placeholder={"2.5"}
              nonZero
            />
          </View>
        </View>
      </View>

      {/* Import data */}
      <View className="flex p-2 mt-4 bg-white rounded-lg">
        {/* Manage Exercises */}
        <TouchableOpacity
          className="flex flex-row items-center space-x-3 border-b-[1px] border-slate-100 pb-1"
          onPress={() => navigation.navigate("Manage Exercises", {})}
        >
          <View className="flex justify-center items-center rounded-md w-8 h-8 bg-blue-600">
            <IconDatabaseImport color="white" strokeWidth={1} />
          </View>
          <View className="flex-grow">
            <Text className="text-lg">Auto-backup to iCloud</Text>
          </View>
          <IconCaretRight strokeWidth={0} fill="grey" />
        </TouchableOpacity>
        {/* Manage Exercises */}
        <TouchableOpacity
          className="flex flex-row items-center space-x-3 pt-1"
          onPress={() => {
            navigation.navigate("Import Data", {});
          }}
        >
          <View className="flex justify-center items-center rounded-md w-8 h-8 bg-blue-600">
            <IconDatabaseImport color="white" strokeWidth={1} />
          </View>
          <View className="flex-grow">
            <Text className="text-lg">Import from FitNotes Android</Text>
          </View>
          <IconCaretRight strokeWidth={0} fill="grey" />
        </TouchableOpacity>
        <TouchableOpacity
          className="flex flex-row items-center space-x-3 pt-1"
          onPress={() => {
            clearDB();
          }}
        >
          <View className="flex justify-center items-center rounded-md w-8 h-8 bg-blue-600">
            <IconDatabaseImport color="white" strokeWidth={1} />
          </View>
          <View className="flex-grow">
            <Text className="text-lg">Reset to default</Text>
          </View>
          <IconCaretRight strokeWidth={0} fill="grey" />
        </TouchableOpacity>
      </View>
    </Pressable>
  );
};
