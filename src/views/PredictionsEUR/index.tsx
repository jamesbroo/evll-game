import { useMatchBreakpoints, useModal } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { PageMeta } from 'components/Layout/Page'
import PageLoader from 'components/Loader/PageLoader'
import useTokenAllowance from 'hooks/useTokenAllowance'
import React, { useEffect, useRef } from 'react'
import { useAppDispatch } from 'state'
import { useInitialBlock } from 'state/block/hooks'
import { initializePredictions } from 'state/predictionsEUR'
import { useGetPredictionsStatus, useIsChartPaneOpen } from 'state/predictionsEUR/hooks'
import { PredictionStatus } from 'state/types'
import { useUserPredictionAcceptedRisk, useUserPredictionChartDisclaimerShow } from 'state/user/hooks'
import { getPredictionsAddress } from 'utils/addressHelpers'
import tokens from 'config/constants/tokens'
import ChartDisclaimer from './components/ChartDisclaimer'
import CollectWinningsPopup from './components/CollectWinningsPopup'
import Container from './components/Container'
import RiskDisclaimer from './components/RiskDisclaimer'
import SwiperProvider from './context/SwiperProvider'
import Desktop from './Desktop'
import usePollOraclePrice from './hooks/usePollOraclePrice'
import usePollPredictions from './hooks/usePollPredictions'
import Mobile from './Mobile'


const PredictionsEUR = () => {
  const { isDesktop } = useMatchBreakpoints()
  const [hasAcceptedRisk, setHasAcceptedRisk] = useUserPredictionAcceptedRisk()
  const [showDisclaimer] = useUserPredictionChartDisclaimerShow()
  const { account } = useWeb3React()
  const status = useGetPredictionsStatus()
  const isChartPaneOpen = useIsChartPaneOpen()
  const dispatch = useAppDispatch()
  const initialBlock = useInitialBlock()
  const handleAcceptRiskSuccess = () => setHasAcceptedRisk(true)
  const [onPresentRiskDisclaimer] = useModal(<RiskDisclaimer onSuccess={handleAcceptRiskSuccess} />, false)
  const [onPresentChartDisclaimer] = useModal(<ChartDisclaimer />, false)

  // TODO: memoize modal's handlers
  const onPresentRiskDisclaimerRef = useRef(onPresentRiskDisclaimer)
  const onPresentChartDisclaimerRef = useRef(onPresentChartDisclaimer)
  console.log('debug EUR st1')
  // Disclaimer
  useEffect(() => {
    if (!hasAcceptedRisk) {
      onPresentRiskDisclaimerRef.current()
    }
  }, [hasAcceptedRisk, onPresentRiskDisclaimerRef])

  // Chart Disclaimer
  useEffect(() => {
    if (isChartPaneOpen && showDisclaimer) {
      onPresentChartDisclaimerRef.current()
    }
  }, [onPresentChartDisclaimerRef, isChartPaneOpen, showDisclaimer])

  useEffect(() => {
    if (initialBlock > 0) {
      // Do not start initialization until the first block has been retrieved
      dispatch(initializePredictions(account))
    }
  }, [initialBlock, dispatch, account])

  usePollPredictions()
  usePollOraclePrice()

  // const currentAllowance = useTokenAllowance(tokens.cake, account, getPredictionsAddress())

  if (status === PredictionStatus.INITIAL) {
    return <PageLoader />
  }

  


  return (
    <>
      <PageMeta />
      <SwiperProvider>
        <Container>
          {isDesktop ? <Desktop /> : <Mobile />}
          <CollectWinningsPopup />
        </Container>
      </SwiperProvider>
    </>
  )
}

export default PredictionsEUR
