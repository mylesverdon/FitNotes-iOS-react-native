import React, { FunctionComponent, useMemo } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { IconCaretLeft, IconCaretRight } from "tabler-icons-react-native";

interface IDateSelect {
  date: Date;
  onDateChange: (newDate: Date) => void;
}

export const DateSelect: FunctionComponent<IDateSelect> = ({
  date,
  onDateChange,
}) => {
  const dateString: string = useMemo(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }
    return date.toDateString();
  }, [date]);

  return (
    <View className="flex flex-row items-center px-2 bg-white">
      <TouchableOpacity
        className="h-10 w-10 flex items-center justify-center"
        onPress={() => {
          const prevDay = new Date(date);
          prevDay.setDate(date.getDate() - 1);
          onDateChange(prevDay);
        }}
      >
        <IconCaretLeft fill="black" />
      </TouchableOpacity>
      <Text className="text-xl flex-grow text-center">{dateString}</Text>
      <TouchableOpacity
        className="h-10 w-10 flex items-center justify-center px-4"
        onPress={() => {
          const nextDay = new Date(date);
          nextDay.setDate(date.getDate() + 1);
          onDateChange(nextDay);
        }}
      >
        <IconCaretRight fill="black" />
      </TouchableOpacity>
    </View>
  );
};
