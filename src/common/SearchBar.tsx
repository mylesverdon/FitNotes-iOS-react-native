import { FunctionComponent } from "react";
import {
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { IconCaretDown, IconSearch } from "tabler-icons-react-native";
import { Category } from "../database/models/Category";

interface ISearchBar {
  text: string;
  placeholder: string;
  onTextChange: (text: string) => void;
  categories: Category[];
  onCategorySelect: (category: Category | undefined) => void;
  category?: Category;
  dropDownOpen: boolean;
  setDropDownOpen: (isOpen: boolean) => void;
}

export const SearchBar: FunctionComponent<ISearchBar> = ({
  text,
  placeholder,
  onTextChange,
  categories,
  onCategorySelect,
  category,
  dropDownOpen,
  setDropDownOpen,
}) => {
  return (
    <View className="h-10 flex flex-row items-center space-x-4 bg-slate-100 rounded-lg px-4">
      <IconSearch size={18} className="mt-1" color="#888888" />
      <TextInput
        className="flex-grow h-8"
        style={{ fontSize: 18 }}
        placeholder={placeholder}
        placeholderTextColor="#888888"
        value={text}
        onChangeText={onTextChange}
        onFocus={() => {
          setDropDownOpen(false);
        }}
      />
      <TouchableOpacity
        className="h-full pl-4 flex flex-row items-center space-x-1.5 border-l-[1px] border-slate-300"
        onPress={() => {
          setDropDownOpen(!dropDownOpen);
          Keyboard.dismiss();
        }}
      >
        <View
          className={`w-3 h-3 border-slate-400 rounded-full ${
            !category && "border-[1px]"
          }`}
          style={{
            backgroundColor: category ? category.colour : "transparent",
          }}
        />
        <IconCaretDown size={14} fill="#999999" color="#999999" />
      </TouchableOpacity>
      {dropDownOpen && (
        <>
          <View className="absolute flex bg-slate-200 right-0 top-12 p-4 rounded-xl shadow-md">
            <TouchableOpacity
              className="flex flex-row space-x-3 border-b-[1px] border-slate-300 px-2 py-[3px] items-center"
              onPress={() => {
                onCategorySelect(undefined);
                setDropDownOpen(false);
              }}
            >
              <View className="w-3 h-3 rounded-full border-[1px]" />
              <Text className="text-lg">Any Category...</Text>
            </TouchableOpacity>
            {categories.map((_category) => (
              <TouchableOpacity
                className="flex flex-row space-x-3 border-b-[1px] border-slate-300 px-2 py-[3px] items-center"
                key={_category._id}
                onPress={() => {
                  onCategorySelect(_category);
                  setDropDownOpen(false);
                }}
              >
                <View
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: _category.colour }}
                />
                <Text className="text-lg">{_category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
    </View>
  );
};
