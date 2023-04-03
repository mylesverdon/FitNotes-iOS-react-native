import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import { IconMinus, IconPlus } from "tabler-icons-react-native";

interface INumericInput {
  value: number;
  onChange: (value: number) => void;
  step?: number;
  integer?: boolean;
  narrow?: boolean;
  className?: string;
}

export const NumericInput: FunctionComponent<INumericInput> = ({
  value,
  step = 1,
  onChange,
  narrow,
}) => {
  const onIncrement = () => onChange(value + step);
  const onDecrement = () => onChange(value - step);

  return (
    <View className={`flex flex-row items-center w-fit`}>
      <TouchableOpacity
        className={`flex justify-center items-center bg-slate-200 rounded-l-lg ${
          narrow ? "w-10 h-14" : "w-20 h-20"
        }`}
        onPress={onDecrement}
      >
        <IconMinus />
      </TouchableOpacity>
      <NumberInput
        value={value}
        onChange={(value?: number) => {
          onChange(value ?? 0);
        }}
        narrow={narrow}
        fontSize="lg"
      />

      <TouchableOpacity
        className={`flex justify-center items-center bg-slate-200 rounded-r-lg ${
          narrow ? "w-12 h-14" : "w-20 h-20"
        }`}
        onPress={onIncrement}
      >
        <IconPlus />
      </TouchableOpacity>
    </View>
  );
};

interface INumberInput {
  value: number | undefined;
  onChange: (value?: number) => void;
  integer?: boolean;
  placeholder?: string;
  clearable?: boolean;
  narrow?: boolean;
  fontSize?: "md" | "lg";
}

export const NumberInput: FunctionComponent<INumberInput> = ({
  value,
  onChange,
  integer,
  clearable = false,
  placeholder = "-",
  narrow = false,
  fontSize = "md",
}) => {
  const [endsWith, setEndsWith] = useState<string>("");

  const ref = useRef<TextInput>(null);

  return (
    <TextInput
      className={`p-2 text-center rounded-lg ${narrow ? "w-16" : "w-24"}`}
      ref={ref}
      style={{ fontSize: fontSize === "md" ? 18 : 24 }}
      selectTextOnFocus={true}
      keyboardType="decimal-pad"
      value={value?.toString().concat(endsWith)}
      placeholder={placeholder}
      blurOnSubmit={false}
      onBlur={() => {
        if (value === 0 || value === undefined) onChange(undefined);
        setEndsWith("");
      }}
      onChangeText={(text) => {
        if (text.length === 0) {
          onChange(undefined);
          return;
        }

        if (text === ".") {
          onChange(0);
          setEndsWith(".");
          return;
        }

        const numDots = Array.from(text).filter((char) => char === ".").length;
        const endsWithDot = !integer && numDots === 1 && text.endsWith(".");
        const endsWithDotZero = !integer && numDots === 1 && /\.0+$/.test(text);
        const endsWithZeroWithDot =
          !integer && numDots === 1 && !endsWithDotZero && /0+$/.test(text);

        const newNum = Number(text);
        if (!Number.isNaN(newNum)) {
          onChange(
            integer
              ? Math.round(newNum)
              : Math.round((newNum + Number.EPSILON) * 1000) / 1000
          );
        }

        if (endsWithDot) {
          setEndsWith(".");
        } else if (endsWithDotZero) {
          setEndsWith(text.match(/\.0+$/)![0]);
        } else if (endsWithZeroWithDot) {
          setEndsWith(text.match(/0+$/)![0]);
        } else {
          setEndsWith("");
        }
      }}
      clearButtonMode={clearable && value !== undefined ? "always" : "never"}
    />
  );
};
