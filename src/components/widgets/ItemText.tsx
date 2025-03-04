import React from "react";
import { FC, useCallback } from "react";
import styled from "styled-components/macro";
import { FontFamily, useZakeke } from "zakeke-configurator-react";
import { Button, Columns, Icon, TextArea } from "../Atomic";
// import Select, { components, GroupBase, OptionProps, SingleValueProps } from 'react-select';
import {
  CSSObjectWithLabel,
  GroupBase,
  OptionProps,
  SingleValueProps,
  components,
} from "react-select";
import { useState } from "react";
import { debounce } from "lodash";

import type { PropChangeHandler } from "../Layout/Designer";

import { ReactComponent as CloseIcon } from "../../assets/icons/times-solid.svg";
import { ReactComponent as BoldIcon } from "../../assets/icons/times-solid.svg";
import { ReactComponent as ItalicSolid } from "../../assets/icons/times-solid.svg";
import { ReactComponent as CurveIcon } from "../../assets/icons/times-solid.svg";
import { FormControl } from "./FormControl";
//import ColorPicker from "./colorpicker";
import AdvancedSelect from './AdvancedSelect';

export interface EditTextItem {
  guid: string;
  name: string;
  text: string;
  fillColor: string;
  fontFamily: string;
  fontWeight: string;
  fontSize: number;
  isTextOnPath: boolean;
  constraints: { [key: string]: any } | null;
}

const defaultColorsPalette = ["#000000", "#FFFFFF"];

enum ItemType {
  Text = 0,
  Image = 1,
}

export interface TextItem {
  type: ItemType;
  areaId: number;
  guid: string;
  name: string;
  text: string;
  strokeColor: string;
  strokeWidth: number;
  fillColor: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  fontStyle: string | undefined;
  fontStretch: string;
  justification: string;
  isTextOnPath: boolean;
  constraints: {
    [key: string]: any;
  } | null;
}

const ItemTextContainer = styled.div``;

const TextToolsContainer = styled.div`
  display: flex;
  flex-direction: row;
  grid-gap: 10px;
  flex-wrap: wrap;
  top: 20%;
`;

const TextButtonsContainer = styled.div`
  width: 50%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 5px;
`;

const ColorPickerContainer = styled.div`
  margin-right: 5px;
  width: calc(50% - 30px);
`;

const ColorsContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding-bottom: 20px;
  border-bottom: 1px #ccc dotted;
`;

const OptionContainer = styled(components.Option)`
  background-color: white !important;

  &:hover {
    background-color: #ddd !important;
  }

  img {
    max-width: 100%;
    height: 4px;
    object-fit: contain;
  }
`;

const SingleValueContainer = styled(components.SingleValue)`
    
        max-width: 100%;
        height: 32px;
        object-fit: contain;
    }
`;


const SinglePaletteItem = styled.div<{ color: string; selected: boolean }>`
	width: 20px;
	height: 20px;
	background-color: ${(props) => props.color};
	border: 1px lightgray solid;
	cursor: pointer;

	${(props) => props.selected && `border: 1px black solid;`}

	&:hover {
		opacity: 0.6;
	}
`;

const TextColorsContainer = styled.div<{ $isDefaultPalette?: boolean }>`
	display: grid;
	${(props) =>
		!props.$isDefaultPalette &&
		`
    grid-template-columns: repeat(auto-fill,minmax(20px,1fr));
    grid-gap: 5px;`};
	/* grid-template-columns: repeat(auto-fill,minmax(20px,1fr)); */
	width: 100%;
`;

const FontCustomOption = styled.img`
	max-width: 100%;
	height: 24px;
	object-fit: contain;
`;

const FontCustomSingleValue = styled.img`
	max-width: 100%;
	height: 24px;
	object-fit: contain;
`;

const FontCustomSingleValueContainer = styled.div`
	display: flex;
	place-content: center;
	width: 100%;
	height: 100%;
`;

const FontOption = (props: JSX.IntrinsicAttributes & OptionProps<any, boolean, GroupBase<any>>) => {
	return (
		<components.Option {...props}>
			{<FontCustomOption src={props.data.imageUrl} alt={props.data.name} />}
		</components.Option>
	);
};

const FontSingleValue = (props: JSX.IntrinsicAttributes & SingleValueProps<any, boolean, GroupBase<any>>) => {
	return (
		<components.SingleValue {...props}>
			<FontCustomSingleValueContainer>
				{<FontCustomSingleValue src={props.data.imageUrl} alt={props.data.name} />}
			</FontCustomSingleValueContainer>
		</components.SingleValue>
	);
};
const ItemText: FC<{
  item: EditTextItem;
  handleItemPropChange: PropChangeHandler;
  fonts?: FontFamily[];
  hideRemoveButton?: boolean;
}> = ({ item, handleItemPropChange, hideRemoveButton }) => {
  const { removeItem, fonts } = useZakeke();

  console.log(fonts, "fonts");

  const constraints = item.constraints;
  const canEdit = constraints?.canEdit ?? true;
  const hasCurvedText = item.isTextOnPath;
  const isUpperCase = constraints?.toUppercase ?? false;

  // Used for performance cache
  const [fillColor, setFillColor] = useState(item.fillColor);

  const weightData =
    typeof item.fontWeight === "number"
      ? ["normal", "normal"]
      : item.fontWeight.split(" ");
  const isBold =
    weightData.length > 1 ? weightData[1] === "bold" : weightData[0] === "bold";
  const isItalic = weightData.length > 1 ? weightData[0] === "italic" : false;
  const [textAreaLength, setTextAreaLength] = useState(item.text.length);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let stringWithZeroWidthSpace = e.target.value.replace(/\u200B/g, "");

    console.log(stringWithZeroWidthSpace.length);

    setTextAreaLength(e.target.value.length);
    if (handleItemPropChange)
      handleItemPropChange(
        item as TextItem,
        "text",
        isUpperCase
          ? e.currentTarget.value.toUpperCase()
          : e.currentTarget.value
      );
  };

  //eslint-disable-next-line
  const handleFillColorChange = useCallback(
    debounce((color: string) => {
      handleItemPropChange(item, "font-color", color);
    }, 500),
    []
  );

  let currentFont = fonts?.find((x) => x.name === item.fontFamily);

  const [fontLoading, setFontLoading] = useState(false);

  const setItemTextDebounced = (value: string) => {
    handleItemPropChange?.(item, 'text', isUpperCase ? value.toUpperCase() : value);
    debounce(() => {
        const initialText = value;
        
        const text = value;

        if (text !== initialText) {
            handleItemPropChange?.(item, 'text', isUpperCase ? text.toUpperCase() : text);
        }
    }, 500)();
};

  const handleFontChange = (font: string) => {
    handleItemPropChange(item, 'font-family', font);
    currentFont = fonts?.find((x) => x.name === font);
    setItemTextDebounced(item.text);
};



  if (item)
    return (
      <ItemTextContainer>
        <FormControl
          label={item.name || "Add Text"}
          // rightComponent={!hideRemoveButton && item.constraints!.canDelete
          // && <Icon onClick={() => removeItem(item.guid)}><CloseIcon /></Icon>}
        >
          <TextArea
            value={isUpperCase ? item.text.toUpperCase() : item.text}
            onChange={handleChange}
            maxLength={
              !item.constraints ? null : item.constraints.maxNrChars || null
            }
            disabled={!canEdit}
          />
          <span
            style={{ position: "relative", paddingTop: "25px", right: "23px" }}
          >
            {textAreaLength}
          </span>
        </FormControl>

        <TextToolsContainer>
          {(!constraints || constraints.canChangeFontFamily) && (
            <FormControl label={"Font"}>
              <AdvancedSelect
                components={{
                  Option: FontOption,
                  SingleValue: FontSingleValue,
                }}
                styles={{
                  container: (base) =>
                    ({
                      ...base,
                      width: 200,
                      marginTop: 20
                    } as CSSObjectWithLabel),
                }}
                isSearchable={false}
                options={fonts}
                isDisabled={fontLoading}
                menuPosition="fixed"
                value={[fonts!.find((x) => x.name === item.fontFamily)]}
                onChange={(font: any) => {
                  item.fontFamily = font.name;
                  setFontLoading(true);
                  handleFontChange(font.name);
                  setTimeout(() => {
                    setFontLoading(false);
                  }, 2000);
                }}
              />

              {/* <Select
                        styles={{
                            container: base => ({
                                ...base,
                                minWidth: 200,
                                top: '20%',
                            }),
                            
                        }}
                        isSearchable={false}
                        options={fonts}
                        menuPosition="fixed"
                        components={{
                            Option: FontOption,
                            SingleValue: FontSingleValue
                        }}
                        value={[fonts!.find(x => x.name === item.fontFamily)]}
                        onChange={(font: any) => handleItemPropChange(item, 'font-family', font.name)}
                    /> */}
            </FormControl>
          )}
          {/* <TextButtonsContainer>
                    {(!constraints || constraints.canChangeFontWeight) && <FormControl label={"Style"}>
                        <Columns columns={2}>
                            <Button
                                outline
                                selected={isBold}
                                onClick={() => handleItemPropChange(item, 'font-bold', !isBold)}>
                                <Icon><BoldIcon /></Icon>
                            </Button>
                            <Button
                                outline
                                selected={isItalic}
                                onClick={() => handleItemPropChange(item, 'font-italic', !isItalic)}>
                                <Icon><ItalicSolid /></Icon>
                            </Button>
                        </Columns>
                    </FormControl>}
                    {(!constraints || constraints.canChangeTextPathMode) && <FormControl label={"Curved"}>
                        <Button
                            outline
                            selected={hasCurvedText}
                            onClick={() => handleItemPropChange(item, 'text-path', !hasCurvedText)}>
                            <Icon><CurveIcon /></Icon>
                        </Button>
                    </FormControl>}
                </TextButtonsContainer> */}
        </TextToolsContainer>

        {/* {(!disableTextColors || !(disableTextColors && textColors.length === 1)) && <FormControl label={T._("Color", "Composer")}>
                <ColorsContainer>
                    {!disableTextColors && <ColorPickerContainer>
                        <ColorPicker
                            color={fillColor}
                            onChange={color => {
                                // handleFillColorChange(color);
                                handleItemPropChange(item, 'font-color', color);
                                setFillColor(color);
                            }} />
                    </ColorPickerContainer>}

                    {!disableTextColors && <TextColorsContainer isDefaultPalette>
                        {(defaultColorsPalette).map(hex => <SinglePaletteItem
                            key={hex}
                            onClick={() => {
                                handleItemPropChange(item, 'font-color', hex);
                                setFillColor(hex);
                            }}
                            selected={hex === fillColor}
                            color={hex}
                        />)}
                    </TextColorsContainer>}

                    {disableTextColors && <TextColorsContainer>
                        {textColors.map(textColor => <SinglePaletteItem
                            key={textColor.colorCode}
                            onClick={() => {
                                handleItemPropChange(item, 'font-color', textColor.colorCode)
                                setFillColor(textColor.colorCode);
                            }}
                            selected={textColor.colorCode === fillColor}
                            color={textColor.colorCode}
                        />)}
                    </TextColorsContainer>}
                </ColorsContainer>
            </FormControl>} */}
      </ItemTextContainer>
    );
  else return null;
};

export default ItemText;
