import { Argv } from 'yargs'
import { GithubClient } from '../clients/github_client'
import { logger } from '../logger'
import { median } from '../../src/utilities/math'

interface PrsArgv {}

export const command = 'diffsperengineer'
export const describe = 'Displays diggs per engineer for users within an org over time.'
export const aliases = ['p']

export function builder(yargs: Argv<PrsArgv>): Argv {
  return yargs
}

export async function handler() {
  const fromDate = await logger.prompt('Analyze data from which date? (YYYY-MM-DD)', {
    type: 'text',
  })
  const login = await GithubClient.login()

  console.log('Using this Github account to retrieve data and inspect: %s', login)

  const users = await GithubClient.usersForOrg('workiva')

  console.log(`Number of users: ${users.length}`)
  console.log('DONE!!')

  const prCountsPerUser = []

  for (const user of users) {
    const prSummary = await GithubClient.prSummaryForUser(user, fromDate)
    console.log(`User: ${user}`)
    console.log(`Number of pull requests: ${prSummary.count}`)
    prCountsPerUser.push(prSummary.count)
  }

  const medianDiffsPerEngineer = median(prCountsPerUser)
  console.log(`Median diffs per engineer: ${medianDiffsPerEngineer}`)

  const averageDiffsPerEngineer = prCountsPerUser.reduce((a, b) => a + b, 0) / prCountsPerUser.length
  console.log(`Average diffs per engineer: ${averageDiffsPerEngineer}`)
}
