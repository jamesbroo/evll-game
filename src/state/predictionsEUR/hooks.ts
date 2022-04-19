import { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { ethers } from 'ethers'
import { minBy, orderBy } from 'lodash'
import { isAddress } from 'utils'
import { useAppDispatch } from 'state'
import { State, NodeRound, ReduxNodeLedger, NodeLedger, ReduxNodeRound } from '../types'
import { parseBigNumberObj } from './helpers'
import { fetchAddressResult } from '.'

export const useGetRounds = () => {
  const rounds = useSelector((state: State) => state.predictionsEUR.rounds)
  return Object.keys(rounds).reduce((accum, epoch) => {
    return {
      ...accum,
      [epoch]: parseBigNumberObj<ReduxNodeRound, NodeRound>(rounds[epoch]),
    }
  }, {}) as { [key: string]: NodeRound }
}

export const useGetRound = (epoch: number) => {
  const round = useSelector((state: State) => state.predictionsEUR.rounds[epoch])
  return parseBigNumberObj<ReduxNodeRound, NodeRound>(round)
}

export const useGetSortedRounds = () => {
  const roundData = useGetRounds()
  return orderBy(Object.values(roundData), ['epoch'], ['asc'])
}

export const useGetBetByEpoch = (account: string, epoch: number) => {
  const bets = useSelector((state: State) => state.predictionsEUR.ledgers)

  if (!bets[account]) {
    return null
  }

  if (!bets[account][epoch]) {
    return null
  }

  return parseBigNumberObj<ReduxNodeLedger, NodeLedger>(bets[account][epoch])
}

export const useGetIsClaimable = (epoch) => {
  const claimableStatuses = useSelector((state: State) => state.predictionsEUR.claimableStatuses)
  return claimableStatuses[epoch] || false
}

/**
 * Used to get the range of rounds to poll for
 */
export const useGetEarliestEpoch = () => {
  return useSelector((state: State) => {
    const earliestRound = minBy(Object.values(state.predictionsEUR.rounds), 'epoch')
    return earliestRound?.epoch
  })
}

export const useIsHistoryPaneOpen = () => {
  return useSelector((state: State) => state.predictionsEUR.isHistoryPaneOpen)
}

export const useIsChartPaneOpen = () => {
  return useSelector((state: State) => state.predictionsEUR.isChartPaneOpen)
}

export const useGetCurrentEpoch = () => {
  return useSelector((state: State) => state.predictionsEUR.currentEpoch)
}

export const useGetIntervalSeconds = () => {
  return useSelector((state: State) => state.predictionsEUR.intervalSeconds)
}

export const useGetCurrentRound = () => {
  const currentEpoch = useGetCurrentEpoch()
  const rounds = useGetRounds()
  return rounds[currentEpoch]
}

export const useGetPredictionsStatus = () => {
  return useSelector((state: State) => state.predictionsEUR.status)
}

export const useGetHistoryFilter = () => {
  return useSelector((state: State) => state.predictionsEUR.historyFilter)
}

export const useGetHasHistoryLoaded = () => {
  return useSelector((state: State) => state.predictionsEUR.hasHistoryLoaded)
}

export const useGetCurrentHistoryPage = () => {
  return useSelector((state: State) => state.predictionsEUR.currentHistoryPage)
}

export const useGetMinBetAmount = () => {
  const minBetAmount = useSelector((state: State) => state.predictionsEUR.minBetAmount)
  return useMemo(() => ethers.BigNumber.from(minBetAmount), [minBetAmount])
}

export const useGetBufferSeconds = () => {
  return useSelector((state: State) => state.predictionsEUR.bufferSeconds)
}

export const useGetIsFetchingHistory = () => {
  return useSelector((state: State) => state.predictionsEUR.isFetchingHistory)
}

export const useGetHistory = () => {
  return useSelector((state: State) => state.predictionsEUR.history)
}

export const useGetLastOraclePrice = () => {
  const lastOraclePrice = useSelector((state: State) => state.predictionsEUR.lastOraclePrice)
  return useMemo(() => {
    return ethers.BigNumber.from(lastOraclePrice)
  }, [lastOraclePrice])
}

/**
 * The current round's lock timestamp will not be set immediately so we return an estimate until then
 */
export const useGetCurrentRoundLockTimestamp = () => {
  const currentRound = useGetCurrentRound()
  const intervalSeconds = useGetIntervalSeconds()

  if (!currentRound.lockTimestamp) {
    return currentRound.startTimestamp + intervalSeconds
  }

  return currentRound.lockTimestamp
}

// Leaderboard
export const useGetLeaderboardLoadingState = () => {
  return useSelector((state: State) => state.predictionsEUR.leaderboard.loadingState)
}

export const useGetLeaderboardResults = () => {
  return useSelector((state: State) => state.predictionsEUR.leaderboard.results)
}

export const useGetLeaderboardFilters = () => {
  return useSelector((state: State) => state.predictionsEUR.leaderboard.filters)
}

export const useGetLeaderboardSkip = () => {
  return useSelector((state: State) => state.predictionsEUR.leaderboard.skip)
}

export const useGetLeaderboardHasMoreResults = () => {
  return useSelector((state: State) => state.predictionsEUR.leaderboard.hasMoreResults)
}

export const useGetAddressResult = (account: string) => {
  return useSelector((state: State) => state.predictionsEUR.leaderboard.addressResults[account])
}

export const useGetOrFetchLeaderboardAddressResult = (account: string) => {
  const addressResult = useGetAddressResult(account)
  const dispatch = useAppDispatch()

  useEffect(() => {
    const address = isAddress(account)

    // If address result is null it means we already tried fetching the results and none came back
    if (!addressResult && addressResult !== null && address) {
      dispatch(fetchAddressResult(account))
    }
  }, [dispatch, account, addressResult])

  return addressResult
}

export const useGetSelectedAddress = () => {
  return useSelector((state: State) => state.predictionsEUR.leaderboard.selectedAddress)
}
