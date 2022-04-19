import React from 'react'
import styled from 'styled-components'
import SwiperCore, { Keyboard, Mousewheel } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Box, Text } from '@pancakeswap/uikit'
import { useGetCurrentEpoch, useGetSortedRounds } from 'state/predictions/hooks'
import EUR from "assets/EUR.png"
import BNB from "assets/bnb.png"
import 'swiper/swiper.min.css'
import RoundCard from './components/RoundCard'
import Menu from './components/Menu'
import useSwiper from './hooks/useSwiper'
import useOnNextRound from './hooks/useOnNextRound'
import useOnViewChange from './hooks/useOnViewChange'
import { PageView } from './types'

SwiperCore.use([Keyboard, Mousewheel])

const StyledSwiper = styled.div`
  .swiper-wrapper {
    align-items: center;
    display: flex;
  }

  .swiper-slide {
    width: 320px;
  }
`

const StyledText  = styled(Text)`
  height: 18px;
  justify-self: start;
  ${({ theme }) => theme.mediaQueries.lg} {
    text-align: center;
  }
`
const StyledAsset = styled.div`
  width: 160px;
  height: 125px;
  border-radius: 24px;
  background-color: #142436;
  text-align: center;
  padding: 10px;
  box-shadow: unset;
`

const Positions: React.FC<{ view?: PageView }> = ({ view }) => {
  const { setSwiper } = useSwiper()
  const rounds = useGetSortedRounds()
  const currentEpoch = useGetCurrentEpoch()
  const previousEpoch = currentEpoch > 0 ? currentEpoch - 1 : currentEpoch
  const previousRound = rounds.find((round) => round.epoch === previousEpoch)
  const swiperIndex = rounds.indexOf(previousRound)

  useOnNextRound()
  useOnViewChange(swiperIndex, view)

  return (
    <Box overflow="hidden">
      <StyledAsset style={{marginLeft: "128px", display: "flex"}} >
          <div style={{marginRight: "32px"}}>
            <a href="/prediction"> <img src={BNB} alt='bnb-img' width="50px" height="50px" />  </a>
            <hr style={{backgroundColor: "#f0b90b", height: "4px"}} />
            <StyledText> 15 min </StyledText>
          </div>
          <div>
            <a href="/predictionEUR"> <img src={EUR} alt='bnb-img' width="50px" height="50px" /> </a>
            <StyledText> 5 min </StyledText>
          </div>
      </StyledAsset>
      <Menu />
      <StyledSwiper>
        <Swiper
          initialSlide={swiperIndex}
          onSwiper={setSwiper}
          spaceBetween={16}
          slidesPerView="auto"
          freeMode
          freeModeSticky
          centeredSlides
          freeModeMomentumRatio={0.25}
          freeModeMomentumVelocityRatio={0.5}
          mousewheel
          keyboard
          resizeObserver
        >
          {rounds.map((round) => (
            <SwiperSlide key={round.epoch}>
              <RoundCard round={round} />
            </SwiperSlide>
          ))}
        </Swiper>
      </StyledSwiper>
    </Box>
  )
}

export default Positions
