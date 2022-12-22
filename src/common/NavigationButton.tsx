import React, { FunctionComponent, ReactNode } from "react";
import { TouchableHighlight, TouchableOpacity, View } from "react-native";

interface INavigationButton {
  children: ReactNode;
  onPress: () => void;
}

export const NavigationButton: FunctionComponent<INavigationButton> = ({
  children,
  onPress,
}) => {
  return (
    <TouchableHighlight
      className="w-12 h-12 items-center justify-center mx-1"
      underlayColor="#888888"
      onPress={onPress}
    >
      {children}
    </TouchableHighlight>
  );
};
