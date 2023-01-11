import { FunctionComponent, useEffect, useMemo, useRef, useState } from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import tinycolor from "tinycolor2";
import Slider from "@react-native-community/slider";

export const HueSelector: FunctionComponent<{
  color: string;
  onChange: (col: string) => void;
}> = ({ color, onChange }) => {
  const colorArray = useMemo(() => {
    const hexColors = [];
    for (let i = 0; i < 360; i++) {
      hexColors.push(tinycolor({ h: i, s: 1, l: 0.5 }).toHexString());
    }
    return hexColors;
  }, []);

  const [sliderValue, setSliderValue] = useState<number>(0);

  useEffect(() => {
    const hue = tinycolor(color).toHsl().h;
    setSliderValue(hue / 360);
  }, [color]);

  return (
    <View className="h-8">
      <View className="absolute w-full px-2 h-3 mt-2.5">
        <LinearGradient
          colors={colorArray}
          className="w-full h-full rounded-full"
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
        />
      </View>
      <Slider
        value={sliderValue}
        style={{ height: "105%" }}
        thumbTintColor={color}
        minimumTrackTintColor="transparent"
        maximumTrackTintColor="transparent"
        onValueChange={(value) => {
          onChange(tinycolor({ h: value * 360, s: 1, l: 0.5 }).toHexString());
        }}
      />
    </View>
  );
};
