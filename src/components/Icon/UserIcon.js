import React from 'react'
import tw, { styled } from 'twin.macro'
import Icon from '@mdi/react'
import {
  mdiAlien,
  mdiCat,
  mdiBird,
  mdiDog,
  mdiDuck,
  mdiFish,
  mdiGhost,
  mdiGoogleDownasaur,
  mdiHorse,
  mdiIceCream,
  mdiJellyfish,
  mdiKangaroo,
  mdiKoala,
  mdiLadybug,
  mdiMushroom,
  mdiMusicClefTreble,
  mdiNinja,
  mdiOneUp,
  mdiOwl,
  mdiPanda,
  mdiPaw,
  mdiPenguin,
  mdiPig,
  mdiPirate,
  mdiPumpkin,
  mdiRabbit,
  mdiRedhat,
  mdiRobot,
  mdiSheep,
  mdiSkull,
  mdiSnail,
  mdiSnake,
  mdiSnowman,
  mdiSpaceInvaders,
  mdiStarFace,
  mdiUnicornVariant,
  mdiMicrophone,
  mdiMicrophoneOff,
} from '@mdi/js'
import {KEY_COLORS} from "../../configs/color";
import {useI18n} from "use-mini18n";

export const ICONS = [
  { icon: mdiAlien, name_ja: 'エイリアン', name_en: 'Alien' },
  { icon: mdiCat, name_ja: 'ネコ', name_en: 'Cats' },
  { icon: mdiBird, name_ja: 'トリ', name_en: 'Bird' },
  { icon: mdiDog, name_ja: 'イヌ', name_en: 'Dog' },
  { icon: mdiDuck, name_ja: 'アヒル', name_en: 'Ducks' },
  { icon: mdiFish, name_ja: 'サカナ', name_en: 'Fish' },
  { icon: mdiGhost, name_ja: 'ゴースト', name_en: 'Ghost' },
  { icon: mdiGoogleDownasaur, name_ja: 'ダウナザウア', name_en: 'Daunasaua' },
  { icon: mdiHorse, name_ja: 'ウマ', name_en: 'Horse' },
  { icon: mdiIceCream, name_ja: 'アイスクリーム', name_en: 'Ice cream' },
  { icon: mdiJellyfish, name_ja: 'クラゲ', name_en: 'Jellyfish' },
  { icon: mdiKangaroo, name_ja: 'カンガルー', name_en: 'Kangaroos' },
  { icon: mdiKoala, name_ja: 'コアラ', name_en: 'Koalas' },
  { icon: mdiLadybug, name_ja: 'テントウムシ', name_en: 'Ladybugs' },
  { icon: mdiMushroom, name_ja: 'マッシュルーム', name_en: 'Mushrooms' },
  { icon: mdiMusicClefTreble, name_ja: 'ト音記号', name_en: 'G clef' },
  { icon: mdiNinja, name_ja: 'ニンジャ', name_en: 'Ninja' },
  { icon: mdiOneUp, name_ja: 'キノコ', name_en: 'Mushroom' },
  { icon: mdiOwl, name_ja: 'フクロウ', name_en: 'Owl' },
  { icon: mdiPanda, name_ja: 'パンダ', name_en: 'Panda' },
  { icon: mdiPaw, name_ja: 'ニクキュウ', name_en: 'Pad' },
  { icon: mdiPenguin, name_ja: 'ペンギン', name_en: 'penguins' },
  { icon: mdiPig, name_ja: 'ブタ', name_en: 'Pigs' },
  { icon: mdiPirate, name_ja: 'パイレーツ', name_en: 'Pirates' },
  { icon: mdiPumpkin, name_ja: 'カボチャ', name_en: 'Pumpkins' },
  { icon: mdiRabbit, name_ja: 'ウサギ', name_en: 'Rabbits' },
  { icon: mdiRedhat, name_ja: 'ハット', name_en: 'Hut' },
  { icon: mdiRobot, name_ja: 'ロボット', name_en: 'Robots' },
  { icon: mdiSheep, name_ja: 'ヒツジ', name_en: 'Sheep' },
  { icon: mdiSkull, name_ja: 'ガイコツ', name_en: 'Skull' },
  { icon: mdiSnail, name_ja: 'カタツムリ', name_en: 'Snails' },
  { icon: mdiSnake, name_ja: 'ヘビ', name_en: 'Snakes' },
  { icon: mdiSnowman, name_ja: 'ユキダルマ', name_en: 'Snowman' },
  { icon: mdiSpaceInvaders, name_ja: 'インベーダー', name_en: 'Invader' },
  { icon: mdiStarFace, name_ja: 'スター', name_en: 'Star' },
  { icon: mdiUnicornVariant, name_ja: 'ユニコーン', name_en: 'Unicorn' },
]

export const getRandomIcon = () => {
  const random = Math.floor(Math.random() * (ICONS.length - 1)) + 1
  return {id: random , ...ICONS[random]}
}

const Container = styled.div(({size}) => [
  tw`flex items-center justify-center flex-col`,
  size === 'large' && tw`w-32`,
  size === 'medium' && tw`w-14`,
  size === 'small' && tw`w-11`
])

const IconWrap = styled.div(({size, color}) => [
  tw`relative flex items-center justify-center rounded-full border border-white`,
  `background-color: rgb(${KEY_COLORS[color || 0].secondary});`,
  size === 'large' && tw`w-32 h-32`,
  size === 'medium' && tw`w-14 h-14`,
  size === 'small' && tw`w-11 h-11`,
])

const IconMute = ({isMute}) => {
  const Wrapper = styled.div(({isMute}) => [
    tw`absolute border border-white rounded-full z-10 w-5 h-5 -bottom-1 -right-1
      flex justify-center items-center bg-key-green text-white`,
    isMute && tw`bg-red-500`
  ])
  return (
    <Wrapper isMute={isMute}>
      <Icon path={isMute ? mdiMicrophoneOff : mdiMicrophone} size={0.6} />
    </Wrapper>
  )
}

const Thumbnail = tw.img`absolute top-0 left-0 object-cover w-full h-full rounded-full`

const Name = tw.p`mt-2 truncate text-xs w-full text-center`

export const UserIcon = (props) => {
  const { size, name, user, mute } = props
  const { lang } = useI18n()
  return (
    <Container {...props} size={size}>
      {
        user && (
          <IconWrap size={size} color={user.key_color_id}>
            {
              user.registered_id
                ? <Thumbnail src={user.thumbnail_url} />
                : <Icon path={ICONS[Number(user.icon_id)].icon} size={size === 'large' ? 4 : 1} color="white" />
            }
            { user && mute && <IconMute isMute={user.is_mute} /> }
          </IconWrap>
        )
      }
      {
        user && name && (
          <Name>{
            user && user.registered_id
              ? lang === 'en'
                ? user.name_en
                : user.name_ja
              : lang === 'en'
                ? user.icon_id ? ICONS[Number(user.icon_id)].name_en : ICONS[0].name_en
                : user.icon_id ? ICONS[Number(user.icon_id)].name_ja : ICONS[0].name_ja
          }</Name>
        ) }
    </Container>
  )
}
