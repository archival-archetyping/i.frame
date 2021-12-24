import tw, { styled } from 'twin.macro'
import { KEY_COLORS } from "../configs/color";

export const Heading1 = tw.h1`text-lg font-bold tracking-widest`
export const Heading2 = tw.h2`text-lg italic tracking-widest`

export const SpanPrimary = styled.span(({palletId}) => [`color: rgb(${KEY_COLORS[palletId].primary})`])
export const SpanSecondary = styled.span(({palletId}) => [`color: rgb(${KEY_COLORS[palletId].secondary})`])
export const SpanWhite = tw.span`text-white`

export const TitleOneLine = ({palletId}) => {
  const id = palletId || 0
  return (
    <Heading2>
      <SpanPrimary palletId={id}>iamas&nbsp;</SpanPrimary>
      <SpanWhite>open_house:&nbsp;</SpanWhite>
      <SpanSecondary palletId={id}>2021</SpanSecondary>
    </Heading2>
  )
}

export const ModalTitle = tw.h3`text-2xl font-medium tracking-widest`
export const ModalAuthor = tw.p`mt-3 flex items-center text-lg pl-4 border-l-2 border-black tracking-widest font-light`
export const ModalContent = tw.p`mt-10 leading-7 text-sm text-black tracking-widest font-medium`
