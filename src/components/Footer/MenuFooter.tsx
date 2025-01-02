import React from 'react'
import ShareIcon from "../../icons/ShareIcon";
import { useZakeke } from "zakeke-configurator-react";
import useStore from "../../Store";



interface MenuFooterProps {
  viewFooter: any;
}

const MenuFooter: React.FC<MenuFooterProps> = ({ viewFooter }) => {

  const { isAddToCartLoading, addToCart, price, useLegacyScreenshot } = useZakeke();
  const { priceFormatter } = useStore();

  return (<div>
    <div className="menu_price" style={{display:'flex', justifyContent:'end', alignItems:'end'}}>
      {/* <div className="price_text">Price: </div> */}
      <div className="price_value" >{priceFormatter.format(price)}</div>
    </div>
    <div className="menu_footer" ref={viewFooter}>
      <div className="menu_actions">

        {/* {isAddToCartLoading ? (
          "Adding to cart..."
        ) : ( */}
        <button
          // onClick={() => addToCart([], undefined, useLegacyScreenshot)}
          className="btn menu_btn_list"
          style={{cursor:'pointer'}}
        >
          Return To listing
        </button>
        {/* )} */}


        {isAddToCartLoading ? (
          "Adding to cart..."
        ) : (
          <button
            onClick={() => addToCart([], undefined, useLegacyScreenshot)}
            className="btn btn-primary menu_btn_cart"
            style={{cursor:'pointer'}}
          >
            Add to cart
          </button>
        )}
        {/* {
              <button className="btn btn-secondary Menu_ff_menu__btn__iOQsk Menu_ff_menu__btn__share__1sacu">
                <div className="menu_btn_share_icon">
                  <ShareIcon />
                </div>  
              </button>
            } */}
      </div>
    </div>
  </div>)
}
export default MenuFooter