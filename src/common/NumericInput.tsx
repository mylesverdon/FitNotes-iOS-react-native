import React, {
  FunctionComponent,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";
import {
  TouchableOpacity,
  View,
  TextInput,
  NativeSyntheticEvent,
} from "react-native";
import { NativeComponentType } from "react-native/Libraries/Utilities/codegenNativeComponent";
import { IconMinus, IconPlus } from "tabler-icons-react-native";

interface INumericInput {
  value: number;
  onChange: (value: number) => void;
  step?: number;
  integer?: boolean;
  className?: string;
}

export const NumericInput: FunctionComponent<INumericInput> = ({
  value,
  integer = false,
  step = 1,
  onChange,
  className,
}) => {
  const [liveText, setLiveText] = useState<string>("");

  useEffect(() => {
    setLiveText(value.toString());
  }, [value]);

  const onIncrement = () => onChange(value + step);
  const onDecrement = () => onChange(value - step);

  return (
    <View className={`flex flex-row items-center w-64 ${className}`}>
      <TouchableOpacity
        className="flex justify-center items-center aspect-square w-20 bg-slate-200 rounded-l-lg"
        onPress={onDecrement}
      >
        <IconMinus />
      </TouchableOpacity>
      <TextInput
        className="h-full flex-grow text-center self-start border-b-2 border-slate-400 mx-2 font-bold"
        style={{ fontSize: 24 }}
        keyboardType="numeric"
        value={liveText}
        onChangeText={setLiveText}
        onEndEditing={(e) => {
          const newVal = e.nativeEvent.text;
          const newNum = Number(newVal);
          if (!Number.isNaN(newNum)) {
            onChange(
              integer
                ? Math.round(newNum)
                : Math.round((newNum + Number.EPSILON) * 100) / 100
            );
          } else {
            setLiveText(value.toString());
          }
        }}
      />
      <TouchableOpacity
        className="flex justify-center items-center aspect-square w-20 bg-slate-200 rounded-r-lg"
        onPress={onIncrement}
      >
        <IconPlus />
      </TouchableOpacity>
    </View>
  );
};
