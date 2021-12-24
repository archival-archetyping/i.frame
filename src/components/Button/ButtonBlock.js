import React from 'react'
import tw from 'twin.macro'
import { KEY_COLORS } from "../../configs/color";
import { BackgroundGradientFrom, BackgroundGradientTo } from "../BackgroundGradient";

const ButtonBackgroundGradient = tw.button`relative p-1`

const Inner = tw.div`relative z-10 bg-white px-7 py-1 flex items-center justify-center tracking-widest font-bold text-sm`

export const ButtonBlock = (props) => {
  const { keyColorId } = props
  return (
    <ButtonBackgroundGradient {...props}>
      <BackgroundGradientFrom color={keyColorId && KEY_COLORS[keyColorId].primary} />
      <BackgroundGradientTo color={keyColorId && KEY_COLORS[keyColorId].secondary} />
      <Inner>{props.children}</Inner>
    </ButtonBackgroundGradient>
  )
}
