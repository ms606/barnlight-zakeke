import React, {
  FunctionComponent,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import styled from "styled-components";
import { useZakeke } from "zakeke-configurator-react";
import { ListItem, ListItemImage } from "./list";
import "./selector.css";
import "./Menu/menu.css";
import { Dialog, useDialogManager } from "../components/dialogs/Dialogs";
import ErrorDialog from "../components/dialogs/ErrorDialog";
import ArDeviceSelectionDialog from "../components/dialogs/ArDeviceSelectionDialog";
import Cameras from "./Cameras/Cameras";
import Preview from "./Preview/Preview";
import SvgArrowDown from "../icons/Arrowdown";
import Loader from "../components/Loader/Loader";
import Scroll from "./Scroll/Scroll";
import SelectionIcon from "../icons/SelectionIcon";
import ExplodeSolid from "../assets/icons/expand-arrows-alt-solid.js";

import { ExplodeIconL } from "../assets/icons/ExplodeIcon";
import { Icon } from "./Atomic";
import MenuFooter from "./Footer/MenuFooter";
import Designer from "./Layout/Designer";
// import { customizeGroup } from "../Helpers";
import { AiIcon, ArIcon } from "../components/Layout/LayoutStyles";

import {
  PRODUCT_FULL_SUIT,
  PRODUCT_BLAZER,
  PRODUCT_PANT,
  scrollDownOnClick,
} from "../Helpers";
import Zoom from "./Zoom/Zoom";

const Container = styled.div`
  height: 839px;
  overflow: auto;
  font-family: "Avenir Next", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 16px;
`;

export const ExplodeIcon = styled(Icon)`
  width: 32px;
  height: 32px;
`;

interface SelectorProps {
  refViewer: any; // React.RefObject<HTMLElement>;
  fullScreen: any;
}

const Selector: FunctionComponent<SelectorProps> = ({
  refViewer,
  fullScreen,
}) => {
  const {
    isSceneLoading,
    groups,
    selectOption,
    setCamera,
    setExplodedMode,
    zoomIn,
    zoomOut,
    product,
    IS_IOS,
    IS_ANDROID,
    getMobileArUrl,
    openArMobile,
    isSceneArEnabled,
    productName,
  } = useZakeke();

  console.log(groups, "groups");

  const { showDialog, closeDialog } = useDialogManager();

  // const idsToRemove = [10483, 10482, -1, 10852, 10856, 11209];

  // idsToRemove.push(10640); // id to remove on only blazer product

  // const groups1 = groups.filter((obj) => !idsToRemove.includes(obj.id));

  const groups1 = groups;
  

  // if (product?.name != PRODUCT_PANT) groups1.push(customizeGroup);

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  //console.log(groups,'groups');

  // Keep saved the ID and not the refereces, they will change on each update
  const [selectedGroupId, selectGroup] = useState<number | null>(null);
  const [selectedStepId, selectStep] = useState<number | null>(null);
  const [selectedStepName, selectStepName] = useState<string | null>(null);
  const [selectedAttributeId, selectAttribute] = useState<number | null>(null);
  const [selectedAttributeOptionName, setSelectedAttributeOptionName] =
    useState<string | null>(null);
  const [selectedOptionName, selectOptionName] = useState<string | null>(null);

  const [selectedLiningTypeHeadName, selectLiningTypeHeadName] = useState<
    string | null
  >(null);
  const [selectedLiningTypeName, selectLiningTypeName] = useState<
    string | null
  >(null);

  const [selectedExplodedState, setSelectedExplodedStatese] = useState<
    boolean | null
  >(false);

  const [selectedCameraID, setSelectedCameraID] = useState<string | null>(null);
  const [selectedCameraAngle, setSelectedCameraAngle] = useState<string | null>(
    null
  );
  const [previewImage, setPreviewImage] = useState<any | null>(null);

  const [selectedCollapse, selectCollapse] = useState<boolean | null>(null); // This is the small inner icons
  const [isLoading, setIsLoading] = useState<boolean | null>(false);
  const [checkOnce, setCheckOnce] = useState<boolean | null>(true);

  const [closeAttribute, setCloseAttribute] = useState<boolean | null>(null);

  const viewFooter = useRef<HTMLDivElement | null>(null);

  var selectedGroup = groups1.find((group) => group.id === selectedGroupId);
  var selectedStep = selectedGroup
    ? selectedGroup.steps.find((step) => step.id === selectedStepId)
    : null;

  // Attributes can be in both groups1 and steps, so show the attributes of step or in a group based on selection
  const attributes = useMemo(
    () => (selectedStep || selectedGroup)?.attributes ?? [],
    [selectedGroup, selectedStep]
  );

  const handleArClick = async (arOnFlyUrl: string) => {
    if (IS_ANDROID || IS_IOS) {
      setIsLoading(true);
      const link = new URL(arOnFlyUrl, window.location.href);
      const url = await getMobileArUrl(link.href);
      setIsLoading(false);
      if (url)
        if (IS_IOS) {
          openArMobile(url as string);
        } else if (IS_ANDROID) {
          showDialog(
            "open-ar",
            <Dialog>
              <button
                style={{ display: "block", width: "100%" }}
                onClick={() => {
                  closeDialog("open-ar");
                  openArMobile(url as string);
                }}
              >
                See your product in AR
              </button>
            </Dialog>
          );
        }
    } else {
      showDialog("select-ar", <ArDeviceSelectionDialog />);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
      //   setHeight(window.innerHeight);
    };

    //window.addEventListener('resize', handleResize);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [groups]);

  useEffect(() => {
    //console.log(selectedStepName, "selectStepName");

    const previewImage = attributes.forEach((attr) => {
      attr.options.forEach((option) => {
        if (option.selected && !!option.imageUrl) {
          let Previewdata = {
            image: option.imageUrl,
            optionName: option.id,
            attributeName: attr.id,
            stepName: attr.name,
            groupName: attr.code,
          };

          setPreviewImage(Previewdata);
        }

        // console.log(selectedLiningTypeName, selectedLiningTypeHeadName, "selectedLiningTypeName");

        if (selectedStepName === "LINING TYPE") {
          groups[1].steps[3].attributes[0].options.map((x) => {
            if (x.selected === true) selectLiningTypeName(x.name);
          });

          if (selectedLiningTypeName === "Stretch") {
            groups[1].steps[3].attributes[1].options.map((x) => {
              if (x.selected === true) {
                let Previewdata = {
                  image: x.imageUrl,
                  optionName: x.id,
                  attributeName: attr.id,
                  stepName: attr.name,
                };

                setPreviewImage(Previewdata);
              }
            });
          }
        }
      });
    });
  }, [
    attributes,
    selectedGroup,
    selectedAttributeId,
    selectedCameraID,
    selectedLiningTypeHeadName,
    selectedLiningTypeName,
  ]);

  //  console.log(previewImage,'previewImage');
  const selectedAttribute = attributes.find(
    (attribute) => attribute.id === selectedAttributeId
  );

  // Open the first group and the first step when loaded
  useEffect(() => {
    if (!selectedGroup && groups1.length > 0 && groups1[0].id != -2) {
      selectGroup(groups1[0].id);

      if (groups1[0].steps.length > 0) selectStep(groups1[0].steps[0].id);

      // if (templates.length > 0) setTemplate(templates[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGroup, groups1]);

  // Select attribute first time
  useEffect(() => {
    if (!selectedAttribute && attributes.length === 1)
      selectAttribute(attributes[0]?.id);

    setSelectedAttributeOptionName(
      selectedAttribute && selectedAttribute.options
        ? selectedAttribute.options.find((x) => x.selected === true)?.name ||
            null
        : null
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAttribute, attributes]);

  useEffect(() => {
    if (selectedGroup) {
      const camera = selectedGroup.cameraLocationId;

      if (camera) setCamera(camera);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [selectedGroupId, selectedCameraID, selectedStepId]);
  }, [selectedGroupId]);

  // Camera for left icons
  useEffect(() => {
    if (selectedCameraID) setCamera(selectedCameraID);

    setSelectedCameraID("");
  }, [selectedCameraID]);

  // Camera for attributes
  useEffect(() => {
    if (
      !isSceneLoading &&
      selectedAttribute &&
      selectedAttribute.cameraLocationId
    ) {
      setCamera(selectedAttribute.cameraLocationId);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAttribute, !isSceneLoading]);

  if (isSceneLoading || !groups1 || groups1.length === 0 || isLoading)
    return <Loader visible={true} />;

  // if (isLoading)
  // return <Loader visible={isSceneLoading} />;

  // groups1
  // -- attributes
  // -- -- options
  // -- steps
  // -- -- attributes
  // -- -- -- options

  return (
    <Container>
      {/* {isSceneArEnabled() && (
       <div className="bubble_button_ar">
          <ArIcon hoverable onClick={() => handleArClick('ar.html')}>
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.74 6.86v18.27c0 .76.61 1.37 1.36 1.37h8.28v2H7.1c-1.85 0-3.36-1.51-3.36-3.36V6.86A3.36 3.36 0 017.1 3.5h9.28c.337 0 .663.05.97.143l-.734 1.878a1.364 1.364 0 00-.236-.021h-1.22c-.23.86-1.01 1.5-1.94 1.5h-2.96c-.93 0-1.71-.64-1.95-1.5H7.1c-.75 0-1.36.61-1.36 1.36z" fill="#838383"></path><path d="M12.53 16.31v7.59l7.86 4.78 7.86-4.78v-7.57l-7.64-5.02-8.08 5zm12.79.47l-4.94 2.69-4.86-2.66 5.07-3.14 4.73 3.11zm-10.79 1.77l4.84 2.65v4.5l-4.84-2.94v-4.21zm6.84 7.19v-4.53l4.89-2.66v4.22l-4.89 2.97zM19.158 8.172l.552-1.76h.016l.512 1.76h-1.08zm-2.408 2.04h1.768l.256-.816h1.816l.24.816h1.824L20.574 4.5h-1.72l-2.104 5.712zM23.044 10.212h1.76V8.22h.936c.696 0 .744.568.792 1.112.023.296.055.592.143.88h1.76c-.16-.264-.168-.944-.191-1.224-.064-.712-.36-1.24-.84-1.424.584-.216.855-.84.855-1.432 0-1.08-.864-1.632-1.864-1.632h-3.351v5.712zm1.76-4.352h.824c.671 0 .872.208.872.568 0 .512-.448.568-.776.568h-.92V5.86z" fill="#838383"></path></svg>
          </ArIcon> 
         <div className='bubble_button_text' style={{fontSize: "13px"}}>AR</div>
       </div>
			)} */}

      {product?.name === PRODUCT_FULL_SUIT && (
        <div className="bubble_button">
          <div className="bubble_button_button">
            <ExplodeIcon
              hoverable
              onClick={() => {
                setSelectedExplodedStatese(!selectedExplodedState);
                {
                  selectedExplodedState == true
                    ? setExplodedMode(true)
                    : setExplodedMode(false);
                }
              }}
            >
              <ExplodeSolid />
            </ExplodeIcon>
          </div>

          <div className="bubble_button_text">
            {!selectedExplodedState ? "Close" : "Open"}
          </div>
        </div>
      )}

      {!IS_IOS && (
        <div
          className="bubble_button_fullScreen"
          onClick={() => {
            refViewer.current?.requestFullscreen();

            if (refViewer.current?.webkitRequestFullscreen) {
              refViewer.current.webkitRequestFullscreen();
            }

            const element = refViewer.current;

            if (element) {
              if (element.requestFullscreen) {
                // element.requestFullscreen();
              } else if (element.webkitEnterFullscreen) {
                element.webkitEnterFullscreen(); // Use webkitEnterFullscreen for iOS Safari
              } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen(); // For older Firefox
              } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen(); // For Internet Explorer
              }
            }
          }}
        >
          <div className="bubble_button_button">
            <ExplodeIcon>
              <ExplodeIconL />
            </ExplodeIcon>
          </div>

          <div className="bubble_button_text">Full Screen</div>
        </div>
      )}

      <div
        className="left-keys"
        style={{
          display: "flex",
          position: "absolute",
          left: "3%",
          flexDirection: "column",
          top: "0%",
        }}
      >
        {/* <Cameras
          cameras={groups}
          onSelect={setSelectedCameraID}
          onCameraAngle={setSelectedCameraAngle}
          selectedCameraAngle={selectedCameraAngle}
        /> */}
        {/* {previewImage?.image && <Preview PreviewImage={previewImage} />} */}

        <Zoom zoomIn={zoomIn} zoomOut={zoomOut} />

        <Scroll upRef={refViewer.current} downRef={viewFooter.current} />
      </div>

      <div className="menu">
        <div className="menu_group">
          {groups1.map((group) => {
            const handleGroupClick = (group: any) => {
              selectGroup(group.id);
            };

            return (
              <div
                className={`menu_item ${
                  group.id === selectedGroupId ? "selected" : ""
                }`}
                key={group.id}
                onClick={() => {
                  scrollDownOnClick(checkOnce, setCheckOnce);
                  handleGroupClick(group);
                }}
              >
                {group.id === -1 ? "Other" : group.name}
              </div>
            );
          })}
        </div>
        <br />
        {selectedGroup && selectedGroup.steps.length > 0 && (
          <div className="menu_choice_steps">
            {selectedGroup.steps.map((step) => {
              return (
                <div
                  className="menu_choice_step_step"
                  key={step.id}
                  onClick={() => {
                    selectStepName(step.name);
                    selectStep(step.id);
                    setCamera(step?.cameraLocationID || "");
                    if (selectedStepId != step.id) {
                      selectOptionName("");
                    }
                  }}
                >
                  <div
                    className="menu_choice_step_title"
                    style={{
                      display: "flex",
                      borderBottom:
                        selectedStepId != step.id || !closeAttribute
                          ? "1px solid var(--template-primary--400)"
                          : "",
                    }}
                  >
                    <div
                      className="menu_choice_step_description"
                      onClick={() => {
                        setCloseAttribute(true);
                      }}
                      style={{
                        paddingBottom: "1em",
                        marginRight: "auto",
                      }}
                    >
                      {step.name} stepname
                    </div>
                    <div
                      className="menu_choice_step_toggle"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "12px",
                        lineHeight: "16px",
                        textTransform: "uppercase",
                        color: "var(--template-boundary-color)",
                      }}
                      onClick={() => {
                        setCloseAttribute(!closeAttribute);
                      }}
                    >
                      <div className="triangle"></div>

                      {selectedStepId != step.id || !closeAttribute
                        ? "Customize"
                        : "Close"}
                    </div>
                  </div>

                  {closeAttribute &&
                    step.id === selectedStepId &&
                    step.attributes.map((attribute) => {
                      if (attribute.enabled === false) return <></>;
                      return (
                        <>
                          <div
                            className="menu_choice_attribute_title"
                            style={{
                              color:
                                selectedAttributeId === attribute.id
                                  ? "var(--template-primary--900)"
                                  : "var(--template-primary--600)",
                              borderBottom:
                                selectedAttributeId != attribute.id
                                  ? "1px solid var(--template-primary--400)"
                                  : "",
                            }}
                            onClick={() => {
                              if (selectedAttributeId === attribute.id) {
                                selectAttribute(null);
                              } else {
                                selectAttribute(attribute.id);
                                selectOptionName("");
                              }
                              selectCollapse(!selectedCollapse);

                              selectLiningTypeHeadName(attribute.code);
                            }}
                          >
                            <br />
                            {attribute.name != "Select Your Lining Type" && (
                              <div
                                className="menu_choice_attribute_selection_icon"
                                style={{
                                  width: "21px",
                                  height: "21px",
                                  marginRight: "12px",
                                  fill:
                                    selectedAttributeId === attribute.id
                                      ? "var(--template-primary--900)"
                                      : "var(--template-primary--600)",
                                }}
                              >
                                <SelectionIcon />
                              </div>
                            )}

                            <div
                              className={`menu_choice_attribute_description ${
                                attribute.name === "Select Your Lining Type"
                                  ? `menu_light_bold`
                                  : ""
                              }`}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                marginRight: "auto",
                              }}
                            >
                              {attribute.name}
                            </div>
                            <br />
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                marginRight: "1em",
                              }}
                              className="menu_choice_attribute_selected_option"
                            >
                              {selectedAttributeId === attribute.id
                                ? selectedOptionName
                                : ""}
                            </div>
                            <div
                              className="menu_choice_attribute_state_icon"
                              style={{ width: "21px", height: "21px" }}
                            >
                              <div
                                className={`${
                                  attribute.name === "Select Your Lining Type"
                                    ? `menu_light_bold`
                                    : ""
                                }`}
                                style={{
                                  transform:
                                    attribute.id === selectedAttributeId &&
                                    !selectedCollapse
                                      ? "rotate(-180deg)"
                                      : "",
                                  fill:
                                    attribute.id === selectedAttributeId
                                      ? "var(--template-primary--900)"
                                      : "var(--template-primary--600)",
                                }}
                              >
                                <SvgArrowDown />
                              </div>
                            </div>
                          </div>

                          <div
                            style={{
                              marginTop: "10px",
                              display: "flex",
                              flexDirection: "row",
                              flexWrap: "wrap",
                            }}
                          >
                            {!selectedCollapse &&
                              // (attribute.code != 'Stretch' && attribute.code != 'Lining Style_1') &&
                              attribute.options.map((option) => {
                                return (
                                  <>
                                    {option.enabled == true && (
                                      <div
                                        style={{
                                          marginLeft: "5px",
                                          width: "23%",
                                        }}
                                      >
                                        <div>
                                          {selectedAttributeId ===
                                            option.attribute.id &&
                                            option.imageUrl && (
                                              <ListItem
                                                key={option.id}
                                                onClick={() => {
                                                  attribute.options.map((x) => {
                                                    if (x.selected === true)
                                                      selectLiningTypeName(
                                                        x.name
                                                      );
                                                  });

                                                  selectOption(option.id);
                                                  selectOptionName(option.name);
                                                }}
                                                selected={option.selected}
                                                className="menu_choice_option"
                                              >
                                                <div className="menu_choice_option_image_container">
                                                  {option.imageUrl && (
                                                    <ListItemImage
                                                      src={option.imageUrl}
                                                    />
                                                  )}
                                                </div>

                                                <div className="menu_choice_option_description">
                                                  {option.name}
                                                </div>
                                              </ListItem>
                                            )}
                                        </div>
                                      </div>
                                    )}
                                  </>
                                );
                              })}

                            {/* FOR ONLY STRETCH / NON STRETCH -- HAVE TO REFACTOR LATER */}
                            {/* {!selectedCollapse &&
                              (attribute.code === "Stretch" ||
                                attribute.code === "Lining Style_1") &&
                               attribute.options.map((option) => {
                                console.log(
                                  selectedLiningTypeName,
                                  "selectLiningTypeName"
                                );

                                // if(attribute.enabled === true) return <></>

                                return (
                                  <>
                                    {option.enabled == true && (
                                      <div
                                        style={{
                                          marginLeft: "5px",
                                          width: "23%",
                                        }}
                                      >
                                        <div>
                                          {selectedAttributeId ===
                                            option.attribute.id &&
                                            option.imageUrl && (
                                              <ListItem
                                                key={option.id}
                                                onClick={() => {
                                                  selectOption(option.id);
                                                  selectOptionName(option.name);
                                                }}
                                                selected={option.selected}
                                                className="menu_choice_option"
                                              >
                                                <div className="menu_choice_option_image_container">
                                                  {option.imageUrl && (
                                                    <ListItemImage
                                                      src={option.imageUrl}
                                                    />
                                                  )}
                                                </div>

                                                <div className="menu_choice_option_description">
                                                  {option.name}
                                                </div>
                                              </ListItem>
                                            )}
                                        </div>
                                      </div>
                                    )}
                                  </>
                                );
                              })} */}
                          </div>
                        </>
                      );
                    })}
                </div>
              );
            })}

            {screenWidth < 500 && <MenuFooter viewFooter={viewFooter} />}
          </div>
        )}
        {/* NEW CODE */}

        

        {selectedGroup?.id === -2 && (
          <div>
            <div
              className="textEditor"
              style={{ overflowX: "hidden", height: "100%" }}
            >
              <Designer />
            </div>
            <div
              style={{ position: "relative", bottom: "370px", left: "20px" }}
            >
              {screenWidth < 500 && <MenuFooter viewFooter={viewFooter} />}
            </div>
          </div>
        )}

        <br />
        <br />
        <br />
        {/* closed recently */}
        {screenWidth > 500 && <MenuFooter viewFooter={viewFooter} />}

        {/* ----------------------------------------- */}

        {/* <Menu
         //  groups1={groups1}
           //price={price}
         //  selectedGroupId={selectedGroupId || null}
        // selectedStepId={viewerState?.stepId || null}
        // selectedAttributeId={viewerState?.attributeId || null}
        // setViewerState={setViewerState}
        // viewerState={viewerState}
        //   isCartLoading={isCartLoading}
        // groupSelected={onSelectGroup}
        // stepSelect={onSelectStep}
        // attributeSelected={onSelectAttribute}
        // optionSelected={onSelectOptions}
        // saveText={onSaveText}
        // showCustomizationInfo={onShowCustomizationInfo}
        //   addToCart={onAddToCart}
        // showOptionPreview={onShowOptionPreview}
        // params={customizationParams}
        // share={onShare}
          /> */}
      </div>
    </Container>
  );
};

export default Selector;

// 851 lines of code
