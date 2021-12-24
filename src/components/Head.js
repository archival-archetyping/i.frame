import React from 'react'
import {Helmet} from "react-helmet";
import {useRecoilValue} from "recoil";
import {keyColorIdState} from "../store/app";
import {genFavicon} from "../configs/genFavicon";
import {KEY_COLORS} from "../configs/color";

export const Head = () => {
  const keyColorId = useRecoilValue(keyColorIdState)
  const favicon = genFavicon(KEY_COLORS[keyColorId].primary, KEY_COLORS[keyColorId].secondary)
  return (
    <Helmet>
      <meta charSet="utf-8" />
      <title>iamas open_house: 2021</title>
      <link rel="icon" type="image/png" href={favicon} sizes="16x16" />
    </Helmet>
  )
}
