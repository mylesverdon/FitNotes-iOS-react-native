import { FunctionComponent, ReactNode } from "react";
import { Pressable, View, Text } from "react-native";

export const Chip: FunctionComponent<{
  color: string;
  selected: boolean;
  onSelected: () => void;
  children: ReactNode;
}> = ({ color, selected, onSelected, children }) => {
  return (
    <Pressable
      className={`ml-1 mt-1 p-2 px-2 bg-slate-300  rounded-full flex flex-row space-x-2 items-center justify-center ${
        selected ? "bg-blue-300 shadow-sm" : ""
      }`}
      onPress={onSelected}
    >
      <View
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: color }}
      />
      <Text className="text-sm">{children}</Text>
    </Pressable>
  );
};
