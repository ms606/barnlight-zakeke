import styled, { css } from 'styled-components/macro';
import Carousel from 'nuka-carousel';

export const CarouselContainer = styled(Carousel)`
	border-bottom: 2px solid #c4c4c4;
	position: relative;
`;

export const Icon = styled.div<{ hoverable?: boolean }>`
	display: inline-block;
	width: 24px;
	height: 24px;
	cursor: pointer;

	${(props) =>
		props.hoverable &&
		`
    @media(hover) {
      &:hover {
        opacity: 0.5
      }
    }
  `}

	svg {
		fill: currentColor;
		width: 100%;
		height: 100%;
	}
`;

export const TextArea = styled.textarea`
	background-color: transparent;
	padding-top: 13px;
	height: 39px;
	 font-family: 'Open Sans';
	// padding-left: 10px;
	// padding: 10px 20px;
	color: #414042;
	font-size: 16px;
	border: none;
	border-bottom: 1px var(--template-primary--400) solid;
	width: 100%;
	// min-height: 35px;
	margin-top: 14px;
	 font-family: 'Open Sans';
	outline: none;
	resize: none;

	&:hover {
		// border: 1px black solid;
		border: none;
		border-bottom: 1px var(--template-primary--400) solid;
	}

	&:focus {
		// border: 1px black solid;
		// outline: none;
		border: none;
		border-bottom: 1px var(--template-primary--400) solid;
	}
`;

export const Row = styled.div`
	margin-bottom: 5px;

	&:last-child {
		margin-bottom: 0;
	}
`;

export const ItemLabel = styled.label`
	font-size: 14px;
	display: block;
	margin-bottom: 5px;

	span {
		float: right;
		color: black;
		cursor: pointer;

		&:hover {
			opacity: 0.6;
		}
	}
`;

export const Button = styled.button<{
	primary?: boolean;
	outline?: boolean;
	selected?: boolean;
	disabled?: boolean;
	isFullWidth?: boolean;
	uppercase?: boolean;
}>`
	display: flex;
	justify-content: center;
	align-items: center;
	min-width: ${(props) => (props.isFullWidth ? '100%' : 'unset')};
	background-color: ${(props) => (props.primary ? '#313c46' : 'white')};
	color: ${(props) => (props.outline ? 'black' : props.primary ? 'white' : '#313c46')};
	min-height: 38px;
	padding: ${(props) => (props.outline ? '' : '5px 10px 5px 10px')};
	text-align: center;
	text-transform: ${(props) => (props.uppercase ? 'uppercase' : 'none')};
	// border: ${(props) => (props.outline ? '1px solid lightgray' : '1px solid #313c46')};
	cursor: ${(props) => (!props.disabled ? 'pointer' : 'auto')};

	${(props) =>
		props.selected &&
		`
    border: 1px solid black;
  `}

	${(props) =>
		!props.disabled &&
		`
      &:hover {
        background-color: ${props.outline ? 'white' : props.primary ? '#4b6074' : '#313c46'};
        border: ${props.outline ? '1px solid black' : '1px solid #4b6074'};
        color: ${props.outline ? 'black' : 'white'};
      }
  `}

  ${(props) =>
		props.disabled &&
		`
      background-color: lightgray;
      border: 1px solid gray;
      color: #313c46;
  `}

  ${Icon} + span {
		margin-left: 10px;
	}

	span {
		display: flex;
		text-align: center;
		justify-content: center;
		align-items: center;
	}
`;

export const AddToCartButton = styled(Button)`
	min-width: 200px;
	@media screen and (max-width: 786px) {
	min-width:160px;
	}
`;

export const Columns = styled.div<{ columns: number }>`
	width: 100%;
	display: grid;
	grid-template-columns: repeat(${(props) => props.columns}, 1fr);
`;

export const Rows = styled.div<{ rows: number }>`
	width: 100%;
	display: grid;
	grid-template-rows: repeat(${(props) => props.rows}, 1fr);
`;

export const CloseEditorButton = styled.button`
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	padding: 20px;
	color: white;
	height: 60px;
	background-color: #313c46;
	height: auto;
	font-weight: bold;
	z-index: 11;
`;

const ArrowCss = css`
	position: absolute;
	left: 10px;
	top: 5px;
	background-color: #f1f1f1;
	border-radius: 30px;
	width: 32px;
	height: 32px;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 3;
`;

export const ArrowLeft = styled.div`
	${ArrowCss};
`;
export const ArrowRight = styled.div`
	${ArrowCss};
	left: auto;
	right: 10px;
`;

export const ArrowLeftIconStyled = styled(Icon)`
	font-size: 22px;
`;

export const ArrowRightIconStyled = styled(Icon)`
	font-size: 22px;
`;

export const TooltipContent = styled.div`
	padding: 10px;
`;
