import { Argv } from 'yargs'
import { logger } from '../logger'
import { GithubClient } from '../clients/github_client'

interface PrsArgv {}

export const command = 'myprs'
export const describe = 'Displays data related to pull requests.'
export const aliases = ['p']

export function builder(yargs: Argv<PrsArgv>): Argv {
  return yargs
}

export async function handler() {
  const fromDate = await logger.prompt('Analyze data from which date? (YYYY-MM-DD)', {
    type: 'text',
  })
  const login = await GithubClient.login()
  const prSummary = await GithubClient.prSummaryForUser(login, fromDate)

  console.log(`Number of pull requests: ${prSummary.count}`)
  console.log(`Average time to merge: ${prSummary.averageTimeToMerge.toFixed(2)} hours`)
  console.log(`Median time to merge: ${prSummary.medianTimeToMerge.toFixed(2)} hours`)
  console.log(`Average number of comments: ${prSummary.averageComments}`)
  console.log(`Median number of comments: ${prSummary.medianComments}`)
}
