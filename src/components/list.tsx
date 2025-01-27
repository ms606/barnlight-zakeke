import styled from "styled-components";

export const List = styled.div`
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    margin-bottom: 40px;
    // flex-wrap:wrap;
`;

export const ListItem = styled.div<{ selected?: boolean }>`
     display: flex;
     flex-direction: column;
     //width: calc(22% - 18px);
     justify-content: flex-start;
     align-items: center;
    //  padding: 8px 1px 1px 1px;
    //  background: #fff;
    //  border:2px solid #cccc;
     border-radius: 16px;
    //  margin-top:6px;
    //  margin-bottom: 12px;
    //  margin-right: px;
     cursor: pointer;
    //  @media screen and (max-width: 1013px) {
    //  margin-bottom: 9px;
    //  margin-right: 9px;
    //     }
    
`;

export const ListItemImage = styled.img`
      height: 85px;
      width: 85px;
      background-size: contain;
      background-position: 50%;
      background-repeat: no-repeat;
      position: relative;
      border-radius: 9px;
        @media screen and (max-width: 1013px) {
          width: 60px;
          height: 60px;
        }
    `
