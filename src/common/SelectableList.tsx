import React, { FunctionComponent } from "react";
import { FlatList, View, Text } from "react-native";

interface ISelectableList {
  data: any[];
}

export const SelectableList: FunctionComponent<ISelectableList> = ({
  data,
}) => {
  return (
    <FlatList
      className="flex-shrink px-2 rounded-lg"
      data={data}
      style={{ backgroundColor: "white" }}
      ListFooterComponent={<View className="h-14" />}
      renderItem={({ item: exercise }) => {
        return (
          <TouchableOpacity
            onPress={() => {
              navigation.replace("Exercise Log", { exercise });
            }}
            className="w-full flex flex-row space-x-2 items-center h-12 border-b-[1px] border-slate-300"
          >
            <View
              className={`h-3 w-3 rounded-full ml-3 mr-2`}
              style={{ backgroundColor: exercise.category.colour }}
            />
            <Text
              numberOfLines={1}
              className="flex-grow flex-shrink text-lg min-w-0 text-ellipsis"
            >
              {exercise.name}
            </Text>

            <IconCaretRight strokeWidth={0} fill="grey" />
          </TouchableOpacity>
        );
      }}
    />
  );
};
