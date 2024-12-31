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
import Reset from "../assets/icons/reset.jpg";
import PrintIcon from "../assets/icons/print.jpg";
import ShareIcon from "../assets/icons/share.jpg";
import { Icon } from "./Atomic";
import MenuFooter from "./Footer/MenuFooter";
import Designer from "./Layout/Designer";
import { ReactComponent as CrossIcon } from "../assets/icons/cross.svg";
import { ReactComponent as MenuIcon } from "../assets/icons/menu.svg";
// import { customizeGroup } from "../Helpers";
import { AiIcon, ArIcon } from "../components/Layout/LayoutStyles";

// import {
//   PRODUCT_FULL_SUIT,
//   PRODUCT_BLAZER,
//   PRODUCT_PANT,
//   scrollDownOnClick,
// } from "../../Helpers";
import Zoom from "./Zoom/Zoom";
import ShareDialog from "./dialogs/ShareDialog";
import { PRODUCT_FULL_SUIT, scrollDownOnClick } from "../Helpers";

const Container = styled.div`
  height: 839px;
  overflow: auto;
  font-family: sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 16px;

  @media (max-width: 768px) {
    height: auto;
    overflow: auto;
  }
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
    setCameraByName,
    setExplodedMode,
    zoomIn,
    zoomOut,
    product,
    IS_IOS,
    IS_ANDROID,
    reset,
    getMobileArUrl,
    openArMobile,
    isSceneArEnabled,
    productName,
  } = useZakeke();

  console.log(groups, "groups");

  const { showDialog, closeDialog } = useDialogManager();

  const idsToRemove = [-1];

  // idsToRemove.push(10640); // id to remove on only blazer product

  const groups1 = groups.filter((obj) => !idsToRemove.includes(obj.id));


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

  const [isPopupOpen, setIsPopupOpen] = useState(false);

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


  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const handleShareClick = async () => {
    setCameraByName('buy_screenshot_camera', false, false);
    showDialog('share', <ShareDialog />);
  };

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


      <div className="app">
        <button className="menu-button" onClick={togglePopup}>
          <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M1 12C1 11.4477 1.44772 11 2 11H22C22.5523 11 23 11.4477 23 12C23 12.5523 22.5523 13 22 13H2C1.44772 13 1 12.5523 1 12Z" fill="#0F0F0F"></path> <path d="M1 4C1 3.44772 1.44772 3 2 3H22C22.5523 3 23 3.44772 23 4C23 4.55228 22.5523 5 22 5H2C1.44772 5 1 4.55228 1 4Z" fill="#0F0F0F"></path> <path d="M1 20C1 19.4477 1.44772 19 2 19H22C22.5523 19 23 19.4477 23 20C23 20.5523 22.5523 21 22 21H2C1.44772 21 1 20.5523 1 20Z" fill="#0F0F0F"></path> </g></svg>
        </button>

        {isPopupOpen && (
          <div className="popup">
            <button className="close-button" onClick={togglePopup}>
              X
            </button>
            <div className="popup-buttons">
              <button key={'reset'} onClick={reset}>Reset View</button>
              <button
                onClick={() => {
                  const element = refViewer.current;

                  if (document.fullscreenElement) {
                    // Exit fullscreen if already in fullscreen mode
                    document.exitFullscreen();
                  } else if (element) {
                    // Enter fullscreen mode
                    if (element.requestFullscreen) {
                      element.requestFullscreen();
                    } else if (element.webkitRequestFullscreen) {
                      element.webkitRequestFullscreen();
                    } else if (element.mozRequestFullScreen) {
                      element.mozRequestFullScreen();
                    } else if (element.msRequestFullscreen) {
                      element.msRequestFullscreen();
                    }
                  }
                }}
              >
                Full Screen
              </button>
              <button onClick={() => window.print()}>Print Your Design</button>
              {/* {!isEditorMode && sellerSettings && sellerSettings.shareType !== 0 && ( */}
              <button onClick={handleShareClick}>
                Share Your Design
              </button>
              {/* )}  */}
            </div>
          </div>
        )}
      </div>

      {/* {
        product?.name === PRODUCT_FULL_SUIT && (
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
        )
      } */}

      <div className="" style={{ display: 'flex', flexDirection: 'column', position: 'absolute', left: '50%', gap: '12px' }}>
        {
          !IS_IOS && (
            <div
              className="bubble_buttons"
              onClick={reset}
            >
              <div className="bubble_button_button">
                <ExplodeIcon>
                  <svg
                    version="1.0"
                    xmlns="http://www.w3.org/2000/svg"
                    width="150.000000pt"
                    height="150.000000pt"
                    viewBox="0 0 150.000000 150.000000"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <g
                      transform="translate(0.000000,150.000000) scale(0.100000,-0.100000)"
                      fill="#9a9898"
                      stroke="#000000"
                      stroke-width="3"
                    >
                      <path
                        d="M705 1060 c-98 -16 -195 -62 -195 -92 0 -28 23 -31 61 -9 97 56 239
65 351 22 73 -28 156 -103 193 -174 l28 -53 -28 -53 c-38 -70 -121 -144 -193
-172 -45 -19 -77 -23 -152 -23 -127 0 -191 24 -274 106 -65 63 -65 61 -11 93
14 9 4 19 -65 68 -45 32 -85 55 -91 52 -11 -7 -12 -192 -1 -199 4 -2 18 2 32
9 23 12 28 10 86 -50 224 -230 603 -165 733 126 18 39 18 46 5 79 -76 183
-283 300 -479 270z"
                      />
                      <path
                        d="M709 821 c-21 -22 -29 -39 -29 -66 0 -48 44 -95 90 -95 46 0 90 47
90 95 0 27 -8 44 -29 66 -40 39 -82 39 -122 0z"
                      />
                    </g>
                  </svg>

                </ExplodeIcon>
              </div>

              <div className="bubble_button_text">Reset View</div>
            </div>
          )
        }

        {
          !IS_IOS && (
            <div
              className="bubble_buttons"
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
          )
        }

        {
          !IS_IOS && (
            <div
              className="bubble_buttons"
              onClick={() => window.print()}
            >
              <div className="bubble_button_button">
                <ExplodeIcon>
                  <svg
                    width="143px"
                    height="143px"
                    viewBox="0 0 48 48"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    // xmlns:xlink="http://www.w3.org/1999/xlink"
                    fill="#9b979a"
                    stroke="#9b979a"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                      <g id="ic_fluent_print_48_regular" fill="#9b979a" fill-rule="nonzero">
                        <path
                          d="M16.25,8 L31.75,8 C33.483,8 34.899,9.356 34.995,11.066 L35,11.25 L35,14 L36.75,14 C39.649,14 42,16.351 42,19.25 L42,32.75 C42,34.545 40.545,36 38.75,36 L35,36 L35,37.75 C35,39.545 33.545,41 31.75,41 L16.25,41 C14.455,41 13,39.545 13,37.75 L13,36 L9.25,36 C7.455,36 6,34.545 6,32.75 L6,19.25 C6,16.351 8.351,14 11.25,14 L13,14 L13,11.25 C13,9.517 14.356,8.101 16.066,8.005 L16.25,8 Z M31.75,28.5 L16.25,28.5 C15.836,28.5 15.5,28.836 15.5,29.25 L15.5,37.75 C15.5,38.164 15.836,38.5 16.25,38.5 L31.75,38.5 C32.164,38.5 32.5,38.164 32.5,37.75 L32.5,29.25 C32.5,28.836 32.164,28.5 31.75,28.5 Z M36.75,16.5 L11.25,16.5 C9.731,16.5 8.5,17.731 8.5,19.25 L8.5,32.75 C8.5,33.164 8.836,33.5 9.25,33.5 L13,33.5 L13,29.25 C13,27.455 14.455,26 16.25,26 L31.75,26 C33.545,26 35,27.455 35,29.25 L35,33.5 L38.75,33.5 C39.164,33.5 39.5,33.164 39.5,32.75 L39.5,19.25 C39.5,17.731 38.269,16.5 36.75,16.5 Z M31.75,10.5 L16.25,10.5 C15.87,10.5 15.557,10.782 15.507,11.148 L15.5,11.25 L15.5,14 L32.5,14 L32.5,11.25 C32.5,10.87 32.218,10.557 31.852,10.507 L31.75,10.5 Z"
                        ></path>
                      </g>
                    </g>
                  </svg>
                </ExplodeIcon>
              </div>

              <div className="bubble_button_text">Print</div>
            </div>
          )
        }

        {
          !IS_IOS && (
            <div
              className="bubble_buttons"
              onClick={handleShareClick}
            >
              <div className="bubble_button_button">
                <ExplodeIcon>
                  <svg
                    width="146px"
                    height="146px"
                    viewBox="0 0 24 24"
                    fill="#ffff"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                      <path
                        d="M20 13V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V13M16 8L12 4M12 4L8 8M12 4V16"
                        stroke="#9a9898"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </g>
                  </svg>
                </ExplodeIcon>
              </div>

              <div className="bubble_button_text">Share</div>
            </div>
          )
        }
      </div>


      <div
        className="left-keys"
      >
        {/* <Cameras
          cameras={groups}
          onSelect={setSelectedCameraID}
          onCameraAngle={setSelectedCameraAngle}
          selectedCameraAngle={selectedCameraAngle}
        /> */}
        {/* {previewImage?.image && <Preview PreviewImage={previewImage} />} */}

        <div className=""
          style={{

          }}
        >
          <div style={{ color: '#322332', gap: '2px', display: 'flex', flexDirection: 'column' }}>
            <h1 style={{ fontFamily: "Crimson", fontSize: '38px', fontWeight: 400, margin: '2px' }}>
              The Original<sup>™</sup>
            </h1>
            <h2 style={{ fontFamily: 'Open Sans ,sans-serif', fontSize: '18px', fontWeight: 600, }}>
              Warehouse Gooseneck Light
            </h2>
          </div>
        </div>

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
                className={`menu_item ${group.id === selectedGroupId ? "selected" : ""
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
                              className={`menu_choice_attribute_description ${attribute.name === "Select Your Lining Type"
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
                                className={`${attribute.name === "Select Your Lining Type"
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

        {selectedGroup && (
          <>
            {selectedGroup.attributes.map((step) => {
              if (step.enabled == false) {
                return <></>;
              }

              // console.log(step, "stepppp");
              return (
                <div
                  className="menu_choice_step_step"
                  key={step.id}
                  onClick={() => {
                    selectStepName(step.name);
                    selectStep(step.id);
                    selectOptionName("");
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
                      {step.name}
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

                  {/* {console.log(selectedStepId,step,'ddfdfdfsfds')} */}
                  <div
                    className="x"
                    style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}
                  >
                    {closeAttribute && step.id === selectedStepId && (
                      <>
                        {Array.from(
                          new Map(step.options.map((attribute) => [attribute.id, attribute])).values()
                        )
                          .filter((attribute) => attribute.enabled !== false) // Only include enabled attributes
                          .map((attribute) => (
                            <ListItem
                              key={attribute.id}
                              onClick={() => {
                                selectOption(attribute.id);
                                selectOptionName(attribute.name);
                              }}
                              selected={attribute.selected}
                            >
                              <div className="menu_choice_option_image_container">
                                {attribute.imageUrl && <ListItemImage src={attribute.imageUrl} />}
                              </div>
                              {/* <div className="menu_choice_option_description">{attribute.name}</div> */}
                            </ListItem>
                          ))}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </>
        )}

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
        {/* {screenWidth > 500 && <MenuFooter viewFooter={viewFooter} />} */}
        <MenuFooter viewFooter={viewFooter} />

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
    </Container >
  );
};

export default Selector;

// 851 lines of code
