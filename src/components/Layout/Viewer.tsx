import { useZakeke, ZakekeViewer } from "zakeke-configurator-react";
import { Button } from "../Atomic";
// import ArDeviceSelectionDialog from 'components/dialogs/ArDeviceSelectionDialog';
// import RecapPanel from 'components/widgets/RecapPanel';
import {
  // findAttribute,
  // findGroup,
  // findStep,
  useActualGroups,
} from "../../Helpers";
// import { UndoRedoStep } from 'Interfaces';
import React, { useEffect, useRef, useState } from "react";
import useStore from "../../Store";
import { ReactComponent as BarsSolid } from "../../assets/icons/arrow-right-solid.svg";
import { ReactComponent as DesktopSolid } from "../../assets/icons/arrow-right-solid.svg";
import { ReactComponent as ExpandSolid } from "../../assets/icons/expand-solid.svg";
import { ReactComponent as CollapseSolid } from "../../assets/icons/compress-arrows-alt-solid.svg";
import ExplodeSolid from "../../assets/icons/expand-arrows-alt-solid.js";
import { ReactComponent as RedoSolid } from "../../assets/icons/redo-solid.svg";
import { ReactComponent as ResetSolid } from "../../assets/icons/arrow-right-solid.svg";
import { ReactComponent as SearchMinusSolid } from "../../assets/icons/search-minus-solid.svg";
import { ReactComponent as SearchPlusSolid } from "../../assets/icons/search-plus-solid.svg";
import { ReactComponent as UndoSolid } from "../../assets/icons/undo-solid.svg";
import arIcon from "../../assets/images/ar_icon.png";
import aiIcon from "../../assets/images/ai_icon.png";
import { Dialog, useDialogManager } from "../dialogs/Dialogs";
import styled from "styled-components";
import { Icon } from "../Atomic";

import Cameras from "../Cameras/Cameras";
import Preview from "../Preview/Preview";

import Loader from "../Loader/Loader";



// import Notifications from '../widgets/Notifications';
import {
  AiIcon,
  ArIcon,
  BottomRightIcons,
  CollapseIcon,
  //ExplodeIcon,
  FullscreenIcon,
  RecapPanelIcon,
  RedoIcon,
  ResetIcon,
  SecondScreenIcon,
  TopRightIcons,
  UndoIcon,
  ViewerContainer,
  ZoomInIcon,
  ZoomOutIcon,
} from "./LayoutStyles";
// import TryOnsButton from 'components/widgets/TryOnsButtons';
// import AiDialog from 'components/dialogs/AIDialog';

export const ExplodeIcon = styled(Icon)`
  width: 32px;
  height: 32px;
`;

const Viewer = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const {
    isSceneLoading,
    IS_IOS,
    IS_ANDROID,
    getMobileArUrl,
    openArMobile,
    isSceneArEnabled,
    zoomIn,
    zoomOut,
    sellerSettings,
    reset,
    openSecondScreen,
    product,
    hasExplodedMode,
    setExplodedMode,
    setCamera,
    // hasVTryOnEnabled,
    // getTryOnSettings,
    // isInfoPointContentVisible
  } = useZakeke();

  const [isRecapPanelOpened, setRecapPanelOpened] = useState(
    sellerSettings?.isCompositionRecapVisibleFromStart ?? false
  );

  const { showDialog, closeDialog } = useDialogManager();
  const { setIsLoading, notifications, removeNotification } = useStore();
  const [selectedCameraID, setSelectedCameraID] = useState<string | null>(null);

  const [selectedExplodedState, setSelectedExplodedStatese] = useState<
    boolean | null
  >(false);

  useEffect(() => {
    if (sellerSettings && sellerSettings?.isCompositionRecapVisibleFromStart)
      setRecapPanelOpened(sellerSettings.isCompositionRecapVisibleFromStart);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sellerSettings]);

  useEffect(
    () => {
      if (selectedCameraID) setCamera(selectedCameraID);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedCameraID]
  );

  // const switchFullscreen = () => {
  // 	if (
  // 		(document as any).fullscreenElement ||
  // 		(document as any).webkitFullscreenElement ||
  // 		(document as any).mozFullScreenElement ||
  // 		(document as any).msFullscreenElement
  // 	) {
  // 		quitFullscreen(ref.current!);
  // 	} else {
  // 		launchFullscreen(ref.current!);
  // 	}
  // };

  // const handleArClick = async (arOnFlyUrl: string) => {
  // 	if (IS_ANDROID || IS_IOS) {
  // 		setIsLoading(true);
  // 		const link = new URL(arOnFlyUrl, window.location.href);
  // 		const url = await getMobileArUrl(link.href);
  // 		setIsLoading(false);
  // 		if (url)
  // 			if (IS_IOS) {
  // 				openArMobile(url as string);
  // 			} else if (IS_ANDROID) {
  // 				showDialog(
  // 					'open-ar',
  // 					<Dialog>
  // 						<Button
  // 							style={{ display: 'block', width: '100%' }}
  // 							onClick={() => {
  // 								closeDialog('open-ar');
  // 								openArMobile(url as string);
  // 							}}
  // 						>
  // 							{T._('See your product in AR', 'Composer')}
  // 						</Button>
  // 					</Dialog>
  // 				);
  // 			}
  // 	} else {
  // 		showDialog('select-ar', <ArDeviceSelectionDialog />);
  // 	}
  // };

  const { setIsUndo, undoStack, setIsRedo, redoStack } = useStore();
  //const undoRedoActions = useUndoRedoActions();

  // const handleUndoClick = () => {
  // 	setIsUndo(true);

  // 	let actualUndoStep = undoStack.length > 0 ? undoStack.pop() : null;
  // 	if (actualUndoStep && actualUndoStep.length > 0) {
  // 		undoRedoActions.fillRedoStack(actualUndoStep);
  // 		actualUndoStep
  // 			.filter((x: UndoRedoStep) => x.direction === 'undo')
  // 			.forEach((singleStep: UndoRedoStep) => handleUndoSingleStep(singleStep));
  // 	}

  // 	setIsUndo(false);
  // };

  const { undo, redo } = useZakeke();
  const {
    setSelectedGroupId,
    setSelectedStepId,
    setSelectedAttributeId,
    isMobile,
  } = useStore();

  const actualGroups = useActualGroups() ?? [];


  // const handleUndoSingleStep = (actualUndoStep: UndoRedoStep) => {
  // 	if (actualUndoStep.id === null && !isMobile) return;
  // 	if (actualUndoStep.type === 'group')
  // 		return setSelectedGroupId(findGroup(actualGroups, actualUndoStep.id)?.id ?? null);
  // 	if (actualUndoStep.type === 'step')
  // 		return setSelectedStepId(findStep(actualGroups, actualUndoStep.id)?.id ?? null);
  // 	if (actualUndoStep.type === 'attribute')
  // 		return setSelectedAttributeId(findAttribute(actualGroups, actualUndoStep.id)?.id ?? null);
  // 	if (actualUndoStep.type === 'option') {
  // 		return undo();
  // 	}
  // };

  // const handleRedoClick = () => {
  // 	setIsRedo(true);

  // 	let actualRedoStep = redoStack.length > 0 ? redoStack.pop() : null;
  // 	if (actualRedoStep != null) {
  // 		undoRedoActions.fillUndoStack(actualRedoStep);
  // 		actualRedoStep
  // 			.filter((x: UndoRedoStep) => x.direction === 'redo')
  // 			.forEach(async (singleStep: UndoRedoStep) => handleRedoSingleStep(singleStep));
  // 	}

  // 	setIsRedo(false);
  // };

  // const handleRedoSingleStep = (actualRedoStep: { type: string; id: number | null; direction: string }) => {
  // 	if (actualRedoStep.id === null && !isMobile) return;
  // 	if (actualRedoStep.type === 'group')
  // 		return setSelectedGroupId(findGroup(actualGroups, actualRedoStep.id)?.id ?? null);
  // 	if (actualRedoStep.type === 'step')
  // 		return setSelectedStepId(findStep(actualGroups, actualRedoStep.id)?.id ?? null);
  // 	else if (actualRedoStep.type === 'attribute')
  // 		return setSelectedAttributeId(findAttribute(actualGroups, actualRedoStep.id)?.id ?? null);
  // 	else if (actualRedoStep.type === 'option') return redo();
  // };

  // console.log(document.fullscreenElement,'full screen check');

  if (isSceneLoading)
    return <Loader visible={isSceneLoading} />;

  return (
    <ViewerContainer ref={ref}>
      {/* {!isSceneLoading && <ZakekeViewer backgroundColor="#ffffff" />} */}



      {/* {!isInfoPointContentVisible && ( */}


      {/* {!document.fullscreenElement &&   */}
      <>
        {/* <div style={{ position: "absolute", left: "10px", top: "1%" }}>
          <Cameras
            cameras={actualGroups}
            onSelect={setSelectedCameraID}
          />
     
        </div> */}

        <ZoomInIcon
          isMobile={isMobile}
          key={"zoomin"}
          hoverable
          onClick={zoomIn}
        >
          <SearchPlusSolid />
        </ZoomInIcon>
        <ZoomOutIcon
          isMobile={isMobile}
          key={"zoomout"}
          hoverable
          onClick={zoomOut}
        >
          <SearchMinusSolid />
        </ZoomOutIcon>


       
        {/* {sellerSettings?.canUndoRedo && (
						<ResetIcon isMobile={isMobile} key={'reset'} hoverable onClick={reset}>
							<ResetSolid />
						</ResetIcon>
					)} */}
        {/* {sellerSettings?.canUndoRedo && (
						<UndoIcon isMobile={isMobile} key={'undo'} hoverable onClick={handleUndoClick}>
							<UndoSolid />
						</UndoIcon>
					)}
					{sellerSettings?.canUndoRedo && (
						<RedoIcon isMobile={isMobile} key={'redo'} hoverable onClick={handleRedoClick}>
							<RedoSolid />
						</RedoIcon>
					)}
					{!isSceneLoading && hasVTryOnEnabled && <TryOnsButton settings={getTryOnSettings()} />} */}
        <BottomRightIcons>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "50vh",
              position: "absolute",
              right: "-10%",
              bottom: "0%",
              width: "85px",
              justifyContent: "space-between",
            }}
          >
            {product?.name === 'FlexFabrix™ By DA Suit' && (
              <div className="bubble_button">
                <div className="bubble_button_button">
                  <ExplodeIcon
                    hoverable
                    onClick={() => {
                      {
                        selectedExplodedState == true
                          ? setSelectedExplodedStatese(false)
                          : setSelectedExplodedStatese(true);
                      }
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
              </div>)
            }

            {!document.fullscreenElement && (
              <div
                className="bubble_button_fullScreen"
                onClick={() => {
                  ref.current?.requestFullscreen();
                }}
              >
                <div className="bubble_button_button">
                  <ExplodeIcon>
                    <svg
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8 2H2v6h2V4h4V2zM24 2h6v6h-2V4h-4V2zM8 30H2v-6h2v4h4v2zM24 30h6v-6h-2v4h-4v2zM24 24H8a2.002 2.002 0 01-2-2V10a2.002 2.002 0 012-2h16a2.002 2.002 0 012 2v12a2.002 2.002 0 01-2 2zM8 10v12h16V10H8z"
                        fill="#838383"
                      ></path>
                    </svg>
                  </ExplodeIcon>
                </div>

                <div className="bubble_button_text">Full Screen</div>
              </div>)
            }
          </div>


          {/* {hasExplodedMode() && product && !isSceneLoading && (
            <>
              <CollapseIcon hoverable onClick={() => setExplodedMode(false)}>
                <CollapseSolid />
              </CollapseIcon>
              <ExplodeIcon hoverable onClick={() => setExplodedMode(true)}>
                <ExplodeSolid />
              </ExplodeIcon>
            </>
          )} */}

          {product && product.isShowSecondScreenEnabled && (
            <SecondScreenIcon
              key={"secondScreen"}
              hoverable
              onClick={openSecondScreen}
            >
              <DesktopSolid />
            </SecondScreenIcon>
          )}

          {/* {!IS_IOS && (
							<FullscreenIcon
								className='fullscreen-icon'
								key={'fullscreen'}
								hoverable
								onClick={switchFullscreen}
							>
								<ExpandSolid />
							</FullscreenIcon>
						)} */}
        </BottomRightIcons>
        {/* <TopRightIcons>
						{product && product.isAiConfigurationEnabled && (
							<AiIcon hoverable onClick={() => showDialog('ai', <AiDialog />)}>
								<img src={aiIcon} alt='' />
							</AiIcon>
						)}

						{isSceneArEnabled() && (
							<ArIcon hoverable onClick={() => handleArClick('ar.html')}>
								<img src={arIcon} alt='' />
							</ArIcon>
						)}
					</TopRightIcons> */}
        {sellerSettings?.isCompositionRecapEnabled && (
          <RecapPanelIcon
            key={"recap"}
            onClick={() => setRecapPanelOpened(!isRecapPanelOpened)}
          >
            <BarsSolid />
          </RecapPanelIcon>
        )}
        {/* {sellerSettings?.isCompositionRecapEnabled && isRecapPanelOpened && (
						<RecapPanel key={'recapPanel'} onClose={() => setRecapPanelOpened(false)} />
					)}{' '} */}
      </>
      {/* } */}
      {/* )} */}

      {/* Notifications */}
      {/* <Notifications
				notifications={notifications}
				onRemoveNotificationClick={(notification) => removeNotification(notification.id)}
			/> */}
    </ViewerContainer>
  );
};

export default Viewer;
