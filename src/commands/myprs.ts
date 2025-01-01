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
  const untilDate = await logger.prompt('Analyze data until which date? (YYYY-MM-DD)', {
    type: 'text',
  })
  const login = await GithubClient.login()
  const prSummary = await GithubClient.prSummaryForUser(login, fromDate, untilDate)

  for (const pr of prSummary.prs) {
    console.log(`Title: ${pr.title}`)
    console.log(`URL: ${pr.url}`)
    console.log(`Created: ${pr.created_at}`)
    console.log(`Merged: ${pr.merged_at}`)
    console.log(`Time to merge: ${pr.merge_time.toFixed(2)} hours`)
    console.log(`Comments: ${pr.comments}`)
    console.log('---')
  }

  console.log(`Number of pull requests: ${prSummary.count}`)
  console.log(`Average time to merge: ${prSummary.averageTimeToMerge.toFixed(2)} hours`)
  console.log(`Median time to merge: ${prSummary.medianTimeToMerge.toFixed(2)} hours`)
  console.log(`Average number of comments: ${prSummary.averageComments.toFixed(2)}`)
  console.log(`Median number of comments: ${prSummary.medianComments}`)
}
